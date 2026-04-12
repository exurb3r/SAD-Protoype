import tkinter as tk
from login_ui import LoginWindow
from dashboard_ui import DashboardWindow


def open_login():
    root = tk.Tk()
    LoginWindow(root, open_dashboard)
    root.mainloop()


def open_dashboard(user_data):
    DashboardWindow(user_data, open_login)


if __name__ == "__main__":
    open_login()