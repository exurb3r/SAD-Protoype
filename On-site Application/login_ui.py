import tkinter as tk
from tkinter import messagebox
from api import login


# ── Palette ────────────────────────────────────────────────────────────────────
BG         = "#0D0F14"      # near-black canvas
PANEL      = "#13161E"      # card surface
BORDER     = "#1E2330"      # subtle border
ACCENT     = "#4F8EF7"      # electric-blue accent
ACCENT2    = "#6FEFB8"      # mint secondary
TEXT_PRI   = "#E8EAF0"      # primary text
TEXT_SEC   = "#5A607A"      # muted label
INPUT_BG   = "#0D0F14"      # input field background
HOVER_BTN  = "#3A72D8"      # button hover shade
ERROR      = "#F76F6F"      # error tone

FONT_HEAD  = ("Trebuchet MS", 22, "bold")
FONT_LABEL = ("Trebuchet MS", 9)
FONT_INPUT = ("Courier New", 11)
FONT_BTN   = ("Trebuchet MS", 10, "bold")
FONT_SUB   = ("Trebuchet MS", 8)


class ModernEntry(tk.Frame):
    """Floating-label style entry with animated underline."""

    def __init__(self, parent, placeholder="", show=None, **kwargs):
        super().__init__(parent, bg=PANEL, **kwargs)

        self.placeholder = placeholder
        self._show = show

        # Label sitting above the field
        self.label = tk.Label(
            self, text=placeholder.upper(),
            font=("Trebuchet MS", 7, "bold"),
            fg=TEXT_SEC, bg=PANEL, anchor="w"
        )
        self.label.pack(fill="x", padx=2)

        # Entry
        self.var = tk.StringVar()
        self.entry = tk.Entry(
            self,
            textvariable=self.var,
            show=show or "",
            font=FONT_INPUT,
            fg=TEXT_PRI,
            bg=INPUT_BG,
            insertbackground=ACCENT,
            relief="flat",
            bd=0,
            highlightthickness=0
        )
        self.entry.pack(fill="x", ipady=8, padx=2)

        # Underline bar (inactive)
        self.line = tk.Frame(self, height=1, bg=BORDER)
        self.line.pack(fill="x", padx=2)

        self.entry.bind("<FocusIn>",  self._on_focus)
        self.entry.bind("<FocusOut>", self._on_blur)

    def _on_focus(self, _=None):
        self.line.configure(bg=ACCENT)
        self.label.configure(fg=ACCENT)

    def _on_blur(self, _=None):
        self.line.configure(bg=BORDER)
        self.label.configure(fg=TEXT_SEC)

    def get(self):
        return self.var.get()


class LoginWindow:

    def __init__(self, root, on_login_success):
        self.root = root
        self.on_login_success = on_login_success

        # ── Window chrome ────────────────────────────────────────────────────
        self.root.title("Member Portal — Sign In")
        self.root.geometry("420x560")
        self.root.resizable(False, False)
        self.root.configure(bg=BG)
        self._center(420, 560)

        self._build_ui()

    # ── Layout ───────────────────────────────────────────────────────────────

    def _build_ui(self):
        # Outer padding wrapper
        wrap = tk.Frame(self.root, bg=BG)
        wrap.place(relx=0.5, rely=0.5, anchor="center", width=340)

        # ── Brand mark ───────────────────────────────────────────────────────
        brand = tk.Frame(wrap, bg=BG)
        brand.pack(pady=(0, 32))

        # Small geometric logo — two overlapping rectangles
        canvas = tk.Canvas(brand, width=44, height=44, bg=BG,
                           highlightthickness=0)
        canvas.pack()
        canvas.create_rectangle(4,  12, 28, 36, fill=ACCENT,  outline="")
        canvas.create_rectangle(16, 4,  40, 28, fill=ACCENT2, outline="", stipple="gray50")
        canvas.create_rectangle(16, 12, 28, 28, fill=BG,      outline="")

        tk.Label(brand, text="MEMBER PORTAL", font=("Trebuchet MS", 11, "bold"),
                 fg=TEXT_PRI, bg=BG).pack(pady=(10, 2))
        tk.Label(brand, text="Secure access for registered members",
                 font=FONT_SUB, fg=TEXT_SEC, bg=BG).pack()

        # ── Card ─────────────────────────────────────────────────────────────
        card = tk.Frame(wrap, bg=PANEL, bd=0, highlightbackground=BORDER,
                        highlightthickness=1)
        card.pack(fill="x", pady=(0, 16))

        inner = tk.Frame(card, bg=PANEL)
        inner.pack(padx=28, pady=28, fill="x")

        tk.Label(inner, text="Sign In", font=FONT_HEAD,
                 fg=TEXT_PRI, bg=PANEL).pack(anchor="w", pady=(0, 4))
        tk.Label(inner, text="Enter your credentials to continue",
                 font=FONT_SUB, fg=TEXT_SEC, bg=PANEL).pack(anchor="w", pady=(0, 24))

        # Email
        self.email_field = ModernEntry(inner, placeholder="Email address")
        self.email_field.pack(fill="x", pady=(0, 18))

        # Password
        self.pass_field = ModernEntry(inner, placeholder="Password", show="●")
        self.pass_field.pack(fill="x", pady=(0, 28))

        # Login button
        self.btn = tk.Button(
            inner,
            text="SIGN IN  →",
            font=FONT_BTN,
            fg="#0D0F14",
            bg=ACCENT,
            activebackground=HOVER_BTN,
            activeforeground=TEXT_PRI,
            relief="flat",
            bd=0,
            cursor="hand2",
            command=self.handle_login
        )
        self.btn.pack(fill="x", ipady=12)
        self.btn.bind("<Enter>", lambda _: self.btn.configure(bg=HOVER_BTN, fg=TEXT_PRI))
        self.btn.bind("<Leave>", lambda _: self.btn.configure(bg=ACCENT,    fg="#0D0F14"))

        # Bind Enter key
        self.root.bind("<Return>", lambda _: self.handle_login())

        # ── Footer ────────────────────────────────────────────────────────────
        tk.Label(wrap, text="© 2025 Member Portal  ·  All rights reserved",
                 font=FONT_SUB, fg=TEXT_SEC, bg=BG).pack()

    # ── Logic ─────────────────────────────────────────────────────────────────

    def handle_login(self):
        self.btn.configure(text="SIGNING IN…", state="disabled")
        self.root.update_idletasks()

        success, data = login(
            self.email_field.get(),
            self.pass_field.get()
        )

        if success:
            self.root.destroy()
            self.on_login_success(data)
        else:
            self.btn.configure(text="SIGN IN  →", state="normal")
            self._shake()
            messagebox.showerror("Authentication Failed", data)

    def _shake(self):
        """Brief horizontal shake animation on error."""
        x0, y0 = self.root.winfo_x(), self.root.winfo_y()
        offsets = [8, -8, 6, -6, 4, -4, 0]
        def step(i=0):
            if i < len(offsets):
                self.root.geometry(f"+{x0 + offsets[i]}+{y0}")
                self.root.after(30, step, i + 1)
        step()

    def _center(self, w, h):
        sw = self.root.winfo_screenwidth()
        sh = self.root.winfo_screenheight()
        self.root.geometry(f"{w}x{h}+{(sw-w)//2}+{(sh-h)//2}")
