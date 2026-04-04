import { NavLink } from "react-router-dom";
import LogOutBtn from "./LogOutBtn";
import logo from "../assets/gymlogo.png";
import { 
  FiHome, 
  FiActivity, 
  FiCalendar, 
  FiList, 
  FiBarChart2, 
  FiUsers, 
  FiUser, 
  FiSettings 
} from "react-icons/fi";
import './SideBar.css';

export default function Sidebar({ isOpen, onClose }) {
    const token = localStorage.getItem("token");

    const sections = [
        {
            label: "Main",
            links: [
                { path: "dashboard", label: "Dashboard", icon: <FiHome/> },
                { path: "startworkout", label: "Start Workout", icon: <FiActivity/> },
                { path: "routine", label: "Gym Calendar", icon: <FiCalendar/> },
                { path: "notes", label: "My Fitness List", icon: <FiList/> },
            ]
        },
        {
            label: "Track",
            links: [
                { path: "progress", label: "My Progress", icon: <FiBarChart2/> },
                { path: "gymloginhistory", label: "Gym Status", icon: <FiActivity/> },
                { path: "leaderboard", label: "Leaderboards", icon: <FiUsers/> },
                { path: "community", label: "Community", icon: <FiUsers/> },
            ]
        },
        {
            label: "Account",
            links: [
                { path: "notifications", label: "Notifications"},
                { path: "profile", label: "Profile", icon: <FiUser/> },
                { path: "settings", label: "Settings", icon: <FiSettings/> },
            ]
        }
    ];

    if (!token) return null;

    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-brand">
                <img src={logo} alt="Armzstrong Logo" className="sidebar-logo" />
                <div>
                    <h2 className="sidebar-title">Armztrong</h2>
                    <p className="sidebar-sub">Fitness Tracker</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                {sections.map(section => (
                    <div key={section.label} className="sidebar-section">
                        <span className="sidebar-section-label">{section.label}</span>
                        {section.links.map(link => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    isActive ? "sidebar-link active" : "sidebar-link"
                                }
                                onClick={onClose}
                                >
                                    <span className="sidebar-icon">{link.icon}</span>
                                    <span>{link.label}</span>
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            <LogOutBtn />
        </aside>
    );
}
