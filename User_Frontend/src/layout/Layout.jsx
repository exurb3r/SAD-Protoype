import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { useState } from "react";

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="layout">
            <button
                className={`hamburger-btn ${sidebarOpen ? "active" : ""}`}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;
