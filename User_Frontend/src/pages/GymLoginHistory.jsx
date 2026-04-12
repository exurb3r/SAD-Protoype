import React, { useState, useEffect } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import '../assets/GymStatus.css';

function GymLoginHistory() {
  const [memberships, setMemberships] = useState([]);
  const [logs,        setLogs]        = useState([]);
  const [events,      setEvents]      = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await fetch("http://localhost:3500/users/gymhistory", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setMemberships(data.memberships || []);
        setLogs(data.logs              || []);
        setEvents(data.calendarEvents  || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const fmt = (d) => d
    ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : "N/A";

  return (
    <div className="gs-page">

      {/* HEADER */}
      <div className="gs-header">
        <h1 className="gs-title">My Gym Status</h1>
        <p className="gs-sub">Membership info and visit history</p>
      </div>

      {/* MEMBERSHIP STRIP — horizontal scroll if multiple */}
      {memberships.length === 0 ? (
        <div className="gs-no-membership">No active memberships found.</div>
      ) : (
        <div className="gs-memberships-strip">
          {memberships.map((m, idx) => (
            <div key={idx} className="gs-membership-card">
              <div className="gs-mc-branch">{m.branch}</div>
              <div className="gs-mc-category">{m.category || "N/A"}</div>
              <div className="gs-mc-meta">
                <span>{fmt(m.startDate)}</span>
                <span className="gs-mc-sep">→</span>
                <span>{fmt(m.expiryDate)}</span>
              </div>
              <div className="gs-mc-days">
                <span className="gs-mc-days-num">{m.remainingDays ?? "N/A"}</span>
                <span className="gs-mc-days-label">days left</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CALENDAR + LOG */}
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
                    <th>In</th>
                    <th>Out</th>
                    <th>Branch</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={i}>
                      <td>{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                      <td>{log.timeIn  || "—"}</td>
                      <td>{log.timeOut || "—"}</td>
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