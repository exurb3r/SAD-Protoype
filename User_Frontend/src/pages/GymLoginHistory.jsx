import React, { useState, useEffect } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import '../assets/GymStatus.css';

function GymLoginHistory() {
    const [memberships, setMemberships] = useState([]);
    const [logs, setLogs] = useState([]);
    const [events, setEvents] = useState([]);

    const membership = memberships[0] || {};

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:3500/users/gymhistory", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                setMemberships(data.memberships || []);
                setLogs(data.logs || []);
                setEvents(data.calendarEvents || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const fmt = (dateStr) => dateStr
        ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : "N/A";

    const statusCards = [
        { label: "Membership", value: membership.category || "No Membership", accent: true },
        { label: "Branch",     value: membership.branch || "N/A" },
        { label: "Started",    value: fmt(membership.startDate) },
        { label: "Expires",    value: fmt(membership.expiryDate) },
        { label: "Days Left",  value: membership.remainingDays ?? "N/A" },
    ];

    return (
        <div className="gs-page">

            <div className="gs-header">
                <h1 className="gs-title">My Gym Status</h1>
                <p className="gs-sub">Membership info and visit history</p>
            </div>

            {/* Status cards */}
            <div className="gs-status-row">
                {statusCards.map((card, i) => (
                    <div key={i} className={`gs-status-card ${card.accent ? 'accent' : ''}`}>
                        <span className="gs-status-label">{card.label}</span>
                        <span className="gs-status-value">{card.value}</span>
                    </div>
                ))}
            </div>

            {/* Calendar + table */}
            <div className="gs-layout">

                <div className="gs-card gs-calendar-card">
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        height="100%"
                    />
                </div>

                <div className="gs-card gs-log-card">
                    <div className="gs-card-head">
                        <span className="gs-card-label">Login History</span>
                        <span className="gs-count">{logs.length}</span>
                    </div>

                    <div className="gs-table-wrap">
                        {logs.length === 0 ? (
                            <p className="gs-empty">No login records found.</p>
                        ) : (
                            <table className="gs-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time In</th>
                                        <th>Time Out</th>
                                        <th>Branch</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log, i) => (
                                        <tr key={i}>
                                            <td>{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                                            <td>{log.timeIn}</td>
                                            <td>{log.timeOut}</td>
                                            <td>{log.branch}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default GymLoginHistory;
