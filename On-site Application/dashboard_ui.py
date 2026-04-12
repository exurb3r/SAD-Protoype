import tkinter as tk
from tkinter import messagebox
from api import get_members, get_member_details, member_login, member_logout, rfid_scan
import serial
import threading


# ── Palette ────────────────────────────────────────────────────────────────────
BG         = "#0D0F14"
PANEL      = "#13161E"
SIDEBAR    = "#0F1219"
BORDER     = "#1E2330"
ACCENT     = "#4F8EF7"
ACCENT2    = "#6FEFB8"
TEXT_PRI   = "#E8EAF0"
TEXT_SEC   = "#5A607A"
TEXT_MED   = "#9299B0"
INPUT_BG   = "#0A0C10"
ROW_HOVER  = "#181C26"
ROW_SEL    = "#1A2035"
STATUS_ON  = "#6FEFB8"
STATUS_OFF = "#F76F6F"
STATUS_ACT = "#4F8EF7"

FONT_BRAND = ("Trebuchet MS", 13, "bold")
FONT_LABEL = ("Trebuchet MS", 8, "bold")
FONT_BODY  = ("Trebuchet MS", 10)
FONT_SMALL = ("Trebuchet MS", 8)
FONT_INPUT = ("Trebuchet MS", 10)
FONT_BTN   = ("Trebuchet MS", 9, "bold")


class Pill(tk.Label):
    COLORS = {
        "ACTIVE":        (STATUS_ON,  "#0D2318"),
        "INACTIVE":      (STATUS_OFF, "#2A0D0D"),
        "LOGGED IN":     (STATUS_ACT, "#0D1A35"),
        "NOT LOGGED IN": (TEXT_SEC,   BORDER),
    }
    def __init__(self, parent, text, **kwargs):
        fg, bg = self.COLORS.get(text.upper(), (TEXT_MED, BORDER))
        super().__init__(parent, text=f"  {text}  ",
                         font=("Trebuchet MS", 7, "bold"),
                         fg=fg, bg=bg, **kwargs)


class Divider(tk.Frame):
    def __init__(self, parent, **kwargs):
        super().__init__(parent, height=1, bg=BORDER, **kwargs)


class DashboardWindow:

    def __init__(self, user_data, on_logout):
        self.root = tk.Tk()
        self.root.title("Member Portal — Dashboard")
        self.root.configure(bg=BG)
        self.root.minsize(540, 420)
        self._center(720, 520)

        self.user_data   = user_data
        self.on_logout   = on_logout
        self.members     = []
        self.filtered    = []
        self._last_hover = None

        self._build_ui()
        self.load_members()
        self._rfid_popup_open = False
        self._start_rfid_listener()
        self.root.mainloop()

    def _center(self, w, h):
        sw = self.root.winfo_screenwidth()
        sh = self.root.winfo_screenheight()
        self.root.geometry(f"{w}x{h}+{(sw - w) // 2}+{(sh - h) // 2}")

    # ── UI ────────────────────────────────────────────────────────────────────

    def _build_ui(self):
        # Top bar
        topbar = tk.Frame(self.root, bg=SIDEBAR, height=52)
        topbar.pack(fill="x")
        topbar.pack_propagate(False)

        brand_wrap = tk.Frame(topbar, bg=SIDEBAR)
        brand_wrap.pack(side="left", padx=(18, 0))

        logo = tk.Canvas(brand_wrap, width=24, height=24, bg=SIDEBAR,
                         highlightthickness=0)
        logo.pack(side="left", pady=14)
        logo.create_rectangle(2,  6, 15, 18, fill=ACCENT,  outline="")
        logo.create_rectangle(9,  2, 22, 14, fill=ACCENT2, outline="", stipple="gray50")
        logo.create_rectangle(9,  6, 15, 14, fill=SIDEBAR, outline="")

        tk.Label(brand_wrap, text="MEMBER PORTAL", font=FONT_BRAND,
                 fg=TEXT_PRI, bg=SIDEBAR).pack(side="left", padx=(8, 0))

        tk.Frame(topbar, width=1, bg=BORDER).pack(
            side="left", fill="y", padx=20, pady=10)

        tk.Label(topbar, text="MEMBERS", font=("Trebuchet MS", 8, "bold"),
                 fg=ACCENT, bg=SIDEBAR).pack(side="left")

        right = tk.Frame(topbar, bg=SIDEBAR)
        right.pack(side="right", padx=18)

        uname = self.user_data["user"]["username"]
        chip  = tk.Frame(right, bg=BORDER, padx=10, pady=4)
        chip.pack(side="left", padx=(0, 14))

        dot = tk.Canvas(chip, width=8, height=8, bg=BORDER, highlightthickness=0)
        dot.pack(side="left", padx=(0, 6))
        dot.create_oval(0, 0, 8, 8, fill=ACCENT2, outline="")

        tk.Label(chip, text=uname, font=("Trebuchet MS", 9),
                 fg=TEXT_PRI, bg=BORDER).pack(side="left")

        signout = tk.Button(
            right, text="Sign Out", font=FONT_BTN,
            fg=TEXT_SEC, bg=SIDEBAR,
            activebackground=SIDEBAR, activeforeground=STATUS_OFF,
            relief="flat", bd=0, cursor="hand2",
            command=self.logout
        )
        signout.pack(side="left")
        signout.bind("<Enter>", lambda _: signout.configure(fg=STATUS_OFF))
        signout.bind("<Leave>", lambda _: signout.configure(fg=TEXT_SEC))

        Divider(self.root).pack(fill="x")

        # Search bar
        search_bar = tk.Frame(self.root, bg=PANEL, height=46)
        search_bar.pack(fill="x")
        search_bar.pack_propagate(False)

        search_inner = tk.Frame(search_bar, bg=INPUT_BG,
                                highlightbackground=BORDER, highlightthickness=1)
        search_inner.pack(fill="x", padx=16, pady=8)

        tk.Label(search_inner, text="⌕", font=("Trebuchet MS", 12),
                 fg=TEXT_SEC, bg=INPUT_BG).pack(side="left", padx=(8, 0))

        self.search_var = tk.StringVar()
        self.search_var.trace_add("write", lambda *_: self.filter_members())

        self.search_entry = tk.Entry(
            search_inner, textvariable=self.search_var,
            font=FONT_INPUT, fg=TEXT_PRI, bg=INPUT_BG,
            insertbackground=ACCENT, relief="flat", bd=0,
            highlightthickness=0
        )
        self.search_entry.pack(fill="x", ipady=5, padx=6)

        Divider(self.root).pack(fill="x")

        # Count strip
        count_strip = tk.Frame(self.root, bg=BG, height=26)
        count_strip.pack(fill="x")
        count_strip.pack_propagate(False)

        self.count_lbl = tk.Label(count_strip, text="",
                                   font=FONT_SMALL, fg=TEXT_SEC, bg=BG)
        self.count_lbl.pack(side="left", padx=16, pady=4)

        Divider(self.root).pack(fill="x")

        # Listbox — fills all remaining space
        list_frame = tk.Frame(self.root, bg=BG)
        list_frame.pack(fill="both", expand=True)

        scrollbar = tk.Scrollbar(
            list_frame, orient="vertical",
            bg=PANEL, troughcolor=BG,
            activebackground=ACCENT, width=6, bd=0,
            highlightthickness=0, relief="flat"
        )
        scrollbar.pack(side="right", fill="y")

        self.listbox = tk.Listbox(
            list_frame,
            font=FONT_BODY,
            fg=TEXT_PRI,
            bg=BG,
            selectbackground=ROW_SEL,
            selectforeground=ACCENT,
            activestyle="none",
            relief="flat", bd=0,
            highlightthickness=0,
            yscrollcommand=scrollbar.set,
            cursor="hand2"
        )
        self.listbox.pack(fill="both", expand=True)
        scrollbar.config(command=self.listbox.yview)

        self.listbox.bind("<<ListboxSelect>>", self.on_select)
        self.listbox.bind("<Motion>", self._on_hover)
        self.listbox.bind("<Leave>",  self._on_leave)

        # Status bar
        Divider(self.root).pack(fill="x")
        statusbar = tk.Frame(self.root, bg=SIDEBAR, height=24)
        statusbar.pack(fill="x")
        statusbar.pack_propagate(False)
        tk.Label(statusbar, text="Click a member to view details",
                 font=FONT_SMALL, fg=TEXT_SEC, bg=SIDEBAR).pack(
            side="left", padx=16, pady=4)

    # ── Data ─────────────────────────────────────────────────────────────────

    def load_members(self):
        self.members  = get_members()
        self.filtered = self.members
        self._refresh_list()

    def filter_members(self, event=None):
        kw = self.search_var.get().lower()
        self.filtered = [
            m for m in self.members
            if kw in f"{m['firstname']} {m['lastname']}".lower()
        ]
        self._refresh_list()

    def _refresh_list(self):
        self.listbox.delete(0, tk.END)
        for m in self.filtered:
            self.listbox.insert(tk.END, f"   {m['firstname']} {m['lastname']}")
        n     = len(self.filtered)
        total = len(self.members)
        self.count_lbl.configure(
            text=f"{n} of {total} member{'s' if total != 1 else ''}")

    def _on_hover(self, event):
        idx = self.listbox.nearest(event.y)
        if idx == self._last_hover:
            return
        if self._last_hover is not None:
            self.listbox.itemconfigure(self._last_hover, bg=BG)
        self.listbox.itemconfigure(idx, bg=ROW_HOVER)
        self._last_hover = idx

    def _on_leave(self, _=None):
        if self._last_hover is not None:
            self.listbox.itemconfigure(self._last_hover, bg=BG)
            self._last_hover = None

    # ── Selection ─────────────────────────────────────────────────────────────

    def on_select(self, event):
        if not self.listbox.curselection():
            return
        index   = self.listbox.curselection()[0]
        user_id = self.filtered[index]["_id"]
        data    = get_member_details(user_id)

        if "error" in data:
            messagebox.showerror("Error", data["error"])
            return

        self.show_popup(data, user_id)

    # ── Popup ─────────────────────────────────────────────────────────────────

    def show_popup(self, data, user_id):
        popup = tk.Toplevel(self.root)
        popup.title("Member Detail")
        popup.configure(bg=BG)
        popup.resizable(False, False)
        popup.transient(self.root)
        popup.grab_set()

        pw, ph = 400, 360
        rx = self.root.winfo_x() + (self.root.winfo_width()  - pw) // 2
        ry = self.root.winfo_y() + (self.root.winfo_height() - ph) // 2
        popup.geometry(f"{pw}x{ph}+{rx}+{ry}")

        # Header
        header = tk.Frame(popup, bg=PANEL, height=76)
        header.pack(fill="x")
        header.pack_propagate(False)

        hinner = tk.Frame(header, bg=PANEL)
        hinner.place(relx=0.5, rely=0.5, anchor="center")

        full_name = f"{data['user']['firstname']} {data['user']['lastname']}"
        initials  = (f"{data['user']['firstname'][0]}"
                     f"{data['user']['lastname'][0]}").upper()

        av = tk.Canvas(hinner, width=44, height=44, bg=PANEL,
                       highlightthickness=0)
        av.pack(side="left", padx=(0, 14))
        av.create_oval(0, 0, 44, 44, fill=ACCENT, outline="")
        av.create_text(22, 22, text=initials,
                       font=("Trebuchet MS", 14, "bold"), fill=BG)

        nb = tk.Frame(hinner, bg=PANEL)
        nb.pack(side="left")
        tk.Label(nb, text=full_name, font=("Trebuchet MS", 12, "bold"),
                 fg=TEXT_PRI, bg=PANEL).pack(anchor="w")
        tk.Label(nb, text="Member Profile", font=FONT_SMALL,
                 fg=TEXT_SEC, bg=PANEL).pack(anchor="w")

        Divider(popup).pack(fill="x")

        # Info rows
        body = tk.Frame(popup, bg=BG)
        body.pack(fill="both", expand=True, padx=28, pady=18)

        def info_row(label, pill_text=None, value=None):
            row = tk.Frame(body, bg=BG)
            row.pack(fill="x", pady=5)
            tk.Label(row, text=label, font=FONT_LABEL,
                     fg=TEXT_SEC, bg=BG, width=16, anchor="w").pack(side="left")
            if pill_text:
                Pill(row, pill_text).pack(side="left")
            else:
                tk.Label(row, text=value or "", font=FONT_BODY,
                         fg=TEXT_PRI, bg=BG).pack(side="left")

        info_row("FULL NAME",    value=full_name)
        info_row("MEMBERSHIP",   pill_text=data["membershipStatus"])
        info_row("LOGIN STATUS", pill_text=data["loginStatus"])

        Divider(body).pack(fill="x", pady=(10, 14))

        # Action button
        if data["loginStatus"] == "NOT LOGGED IN":
            act_color = ACCENT2
            act_hover = "#4FD8A0"
            act_text  = "LOG MEMBER IN  →"
            act_cmd   = lambda: self.login_user(user_id, popup)
        else:
            act_color = STATUS_OFF
            act_hover = "#E05555"
            act_text  = "LOG MEMBER OUT  →"
            act_cmd   = lambda: self.logout_user(user_id, popup)

        act_btn = tk.Button(
            body, text=act_text, font=FONT_BTN,
            fg=BG, bg=act_color,
            activebackground=act_hover, activeforeground=BG,
            relief="flat", bd=0, cursor="hand2",
            command=act_cmd
        )
        act_btn.pack(fill="x", ipady=11)
        act_btn.bind("<Enter>", lambda _: act_btn.configure(bg=act_hover))
        act_btn.bind("<Leave>", lambda _: act_btn.configure(bg=act_color))

        close_btn = tk.Button(
            body, text="CLOSE", font=FONT_BTN,
            fg=TEXT_SEC, bg=BG,
            activebackground=BG, activeforeground=TEXT_MED,
            relief="flat", bd=0, cursor="hand2",
            command=popup.destroy
        )
        close_btn.pack(fill="x", ipady=7, pady=(6, 0))
        close_btn.bind("<Enter>", lambda _: close_btn.configure(fg=TEXT_MED))
        close_btn.bind("<Leave>", lambda _: close_btn.configure(fg=TEXT_SEC))

    # ── Actions (same logic as original) ─────────────────────────────────────

    def login_user(self, user_id, popup):
        res = member_login(user_id)

        if "allowWalkIn" in res:
            decision = messagebox.askyesno(
                "Walk-in",
                f"{res['message']}\nLogin as walk-in?"
            )
            if decision:
                res = member_login(user_id, True)
            else:
                return

        messagebox.showinfo("Info", res.get("message", "Unknown response"))
        popup.destroy()
        self.load_members()

    def logout_user(self, user_id, popup):
        res = member_logout(user_id)
        messagebox.showinfo("Info", res.get("message", "Unknown response"))
        popup.destroy()
        self.load_members()

    def logout(self):
        self.root.destroy()
        self.on_logout()

    # ── RFID Listener ─────────────────────────────────────────────────────────────

    def _start_rfid_listener(self):
        ports = ['COM10']  # add whatever ports you want
        self._serial = None

        for port in ports:
            try:
                self._serial = serial.Serial(port, 9600, timeout=1)
                print(f"[RFID] Connected on {port}")
                break
            except Exception as e:
                print(f"[RFID] Skipping {port}: {e}")

        if not self._serial:
            print("[RFID] No RFID reader found on any port")
            return

        thread = threading.Thread(target=self._rfid_loop, daemon=True)
        thread.start()

    def _rfid_loop(self):
        while True:
            try:
                line = self._serial.readline().decode('utf-8').strip()
                if line and line != "RFID_READY":
                    print(f"[RFID] Raw scan: repr={repr(line)}")  # ADD THIS
                    self.root.after(0, self._handle_rfid_scan, line)
            except Exception as e:
                print(f"[RFID] Read error: {e}")
                break

    def _handle_rfid_scan(self, rfid_code):
        """Called on main thread when an RFID is scanned."""
        if self._rfid_popup_open:
            return  # Ignore scan if a popup is already showing

        self._rfid_popup_open = True
        status_code, res = rfid_scan(rfid_code)

        # ── Not found ────────────────────────────────────────────────────────────
        if status_code == 404:
            self._show_rfid_result_popup(
                title="Unknown Card",
                rfid=rfid_code,
                body_lines=[("STATUS", None, "No Registered RFID")],
                action=None
            )
            return

        # ── Wrong branch / expired → offer walk-in ───────────────────────────────
        if status_code == 403 and res.get("allowWalkIn"):
            user = res.get("user", {})
            self._show_rfid_result_popup(
                title="Access Restricted",
                rfid=rfid_code,
                user=user,
                body_lines=[("STATUS", None, res.get("message", "RESTRICTED"))],
                action="walkin",
                action_user_id=None,  # we use rfid for walk-in
                action_rfid=rfid_code
            )
            return

        # ── Success (TIME_IN or TIME_OUT) ─────────────────────────────────────────
        if status_code == 200:
            user = res.get("user", {})
            action = res.get("action", "")
            self._show_rfid_result_popup(
                title="Access Granted" if action == "TIME_IN" else "Logged Out",
                rfid=rfid_code,
                user=user,
                body_lines=[
                    ("ACTION", None, action.replace("_", " ")),
                    ("MEMBERSHIP", None, res.get("membershipStatus", ""))
                ],
                action=None  # Already done — no button needed
            )
            self.load_members()
            return

        # ── Other errors ─────────────────────────────────────────────────────────
        self._show_rfid_result_popup(
            title="Error",
            rfid=rfid_code,
            body_lines=[("ERROR", None, res.get("message", "Unknown error"))],
            action=None
        )

    def _show_rfid_result_popup(self, title, rfid, body_lines,
                                action, user=None,
                                action_user_id=None, action_rfid=None):
        """Generic RFID result popup."""
        popup = tk.Toplevel(self.root)
        popup.title(title)
        popup.configure(bg=BG)
        popup.resizable(False, False)
        popup.transient(self.root)
        popup.grab_set()

        pw, ph = 400, 380
        rx = self.root.winfo_x() + (self.root.winfo_width() - pw) // 2
        ry = self.root.winfo_y() + (self.root.winfo_height() - ph) // 2
        popup.geometry(f"{pw}x{ph}+{rx}+{ry}")

        def on_close():
            self._rfid_popup_open = False
            popup.destroy()

        popup.protocol("WM_DELETE_WINDOW", on_close)

        # ── Header ───────────────────────────────────────────────────────────────
        header = tk.Frame(popup, bg=PANEL, height=76)
        header.pack(fill="x")
        header.pack_propagate(False)

        hinner = tk.Frame(header, bg=PANEL)
        hinner.place(relx=0.5, rely=0.5, anchor="center")

        if user:
            initials = (
                f"{user.get('firstname', '?')[0]}"
                f"{user.get('lastname', '?')[0]}"
            ).upper()
            full_name = f"{user.get('firstname', '')} {user.get('lastname', '')}".strip()
        else:
            initials = "?"
            full_name = "Unknown Member"

        av = tk.Canvas(hinner, width=44, height=44, bg=PANEL, highlightthickness=0)
        av.pack(side="left", padx=(0, 14))
        av.create_oval(0, 0, 44, 44, fill=ACCENT, outline="")
        av.create_text(22, 22, text=initials,
                       font=("Trebuchet MS", 14, "bold"), fill=BG)

        nb = tk.Frame(hinner, bg=PANEL)
        nb.pack(side="left")
        tk.Label(nb, text=full_name, font=("Trebuchet MS", 12, "bold"),
                 fg=TEXT_PRI, bg=PANEL).pack(anchor="w")
        tk.Label(nb, text=f"RFID: {rfid}", font=FONT_SMALL,
                 fg=TEXT_SEC, bg=PANEL).pack(anchor="w")

        Divider(popup).pack(fill="x")

        # ── Body ─────────────────────────────────────────────────────────────────
        body = tk.Frame(popup, bg=BG)
        body.pack(fill="both", expand=True, padx=28, pady=18)

        for label, pill_text, value in body_lines:
            row = tk.Frame(body, bg=BG)
            row.pack(fill="x", pady=5)
            tk.Label(row, text=label, font=FONT_LABEL,
                     fg=TEXT_SEC, bg=BG, width=16, anchor="w").pack(side="left")
            if pill_text:
                Pill(row, pill_text).pack(side="left")
            else:
                tk.Label(row, text=value or "", font=FONT_BODY,
                         fg=TEXT_PRI, bg=BG).pack(side="left")

        Divider(body).pack(fill="x", pady=(10, 14))

        # ── Walk-in button (only shown on 403) ───────────────────────────────────
        if action == "walkin":
            def do_walkin():
                _, wres = rfid_scan(action_rfid, force_walkin=True)
                messagebox.showinfo(
                    "Walk-in",
                    wres.get("message", "Logged in as walk-in"),
                    parent=popup
                )
                self.load_members()
                on_close()

            walkin_btn = tk.Button(
                body, text="LOG IN AS WALK-IN  →", font=FONT_BTN,
                fg=BG, bg=ACCENT2,
                activebackground="#4FD8A0", activeforeground=BG,
                relief="flat", bd=0, cursor="hand2",
                command=do_walkin
            )
            walkin_btn.pack(fill="x", ipady=11)
            walkin_btn.bind("<Enter>", lambda _: walkin_btn.configure(bg="#4FD8A0"))
            walkin_btn.bind("<Leave>", lambda _: walkin_btn.configure(bg=ACCENT2))

        # ── Auto-close after 4 seconds if no action needed ───────────────────────
        if action is None:
            progress = tk.Frame(body, bg=BORDER, height=3)
            progress.pack(fill="x", pady=(0, 6))

            bar = tk.Frame(progress, bg=ACCENT, height=3)
            bar.place(x=0, y=0, relwidth=1.0, height=3)

            total_ms = 4000
            steps = 80
            interval = total_ms // steps

            def shrink(step=0):
                if not popup.winfo_exists():
                    return
                rel = 1.0 - (step / steps)
                bar.place_configure(relwidth=rel)
                if step < steps:
                    popup.after(interval, shrink, step + 1)
                else:
                    on_close()

            popup.after(interval, shrink, 1)

        # ── Close button ─────────────────────────────────────────────────────────
        close_btn = tk.Button(
            body, text="CLOSE", font=FONT_BTN,
            fg=TEXT_SEC, bg=BG,
            activebackground=BG, activeforeground=TEXT_MED,
            relief="flat", bd=0, cursor="hand2",
            command=on_close
        )
        close_btn.pack(fill="x", ipady=7, pady=(6, 0))
        close_btn.bind("<Enter>", lambda _: close_btn.configure(fg=TEXT_MED))
        close_btn.bind("<Leave>", lambda _: close_btn.configure(fg=TEXT_SEC))
