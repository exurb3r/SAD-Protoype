import { NavLink } from "react-router-dom";

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
                <h2 className="sidebar-title">Armzstrong</h2>
                <p className="sidebar-sub">Fitness Tracker</p>
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