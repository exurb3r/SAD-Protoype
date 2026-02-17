import { NavLink } from "react-router-dom";
import logo from "../assets/gymlogo.png";


export default function Sidebar() {
    const links = [
        { path: "dashboard", label: "Dashboard" },
        { path: "startworkout", label: "Start Workout" },
        { path: "routine", label: "View/Edit Routine" },
        { path: "notes", label: "Notes" },
        { path: "progress", label: "Progress" },
        { path: "friends", label: "Friends" },
        { path: "achievements", label: "Achievements" },
        { path: "gymhistory", label: "Gym Login History" },
        { path: "announcements", label: "Notifications & Announcements" },
        { path: "profile", label: "Profile" },
        { path: "about", label: "About" },
        { path: "settings", label: "Settings" }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <img src={logo} alt="Armzstrong Logo" className="sidebar-logo" />
                    <div>
                        <h2 className="sidebar-title">Armztrong Gym</h2>
                        <p className="sidebar-sub">Fitness Tracker</p>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            isActive ? "sidebar-link active" : "sidebar-link"
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
                <button className="logout-btn">Log Out</button>
            </nav>
        </aside>
    );
}