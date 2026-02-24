import { NavLink } from "react-router-dom";
import LogOutBtn from "./LogOutBtn";
import logo from "../assets/gymlogo.png";

export default function Sidebar({ isOpen, onClose }) {
    const token = localStorage.getItem("token");
    const links = [
        { path: "dashboard", label: "Dashboard" },
        { path: "startworkout", label: "Start Workout" },
        { path: "routine", label: "Gym Calendar" },
        { path: "notes", label: "My Fitness List" },
        { path: "progress", label: "My Progress" },
        { path: "community", label: "Community" },
        { path: "leaderboard", label: "Leaderboards" },
        { path: "gymloginhistory", label: "My Gym Status" },
        { path: "announcements", label: "Notifications & Announcements" },
        { path: "profile", label: "Profile" },
        { path: "about", label: "About" },
        { path: "settings", label: "Settings" }
    ];

    if (!token) return null;

    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>
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
                {links.map(link => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            isActive ? "sidebar-link active" : "sidebar-link"
                        }
                        onClick={onClose} 
                    >
                        {link.label}
                    </NavLink>
                ))}
                <LogOutBtn/>
            </nav>
        </aside>
    );
}
