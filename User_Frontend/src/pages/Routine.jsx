import React, { useState, useEffect } from "react";
import "../assets/GymCalendar.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function Routine() {
    const [events, setEvents] = useState([]);
    const [userEvents, setUserEvents] = useState([]);
    const [gymEvents, setGymEvents] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formData, setFormData] = useState({ title: "", date: "", time: "" });

    const loadData = async () => {
        try {
            const res = await fetch("http://localhost:3500/users/gymcalendar", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await res.json();
            setEvents(data.events || []);
            setUserEvents(data.personalEvents || []);
            setGymEvents(data.gymEvents || []);
        } catch (err) {
            console.error("Error loading calendar:", err);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleAddEvent = async () => {
        try {
            await fetch("http://localhost:3500/users/gymcalendar", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: JSON.stringify(formData)
            });
            await loadData();
            setShowPopup(false);
        } catch (err) { console.error("Add failed:", err); }
    };

    const handleEditEvent = async () => {
        try {
            await fetch(`http://localhost:3500/users/gymcalendar/${selectedEvent._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: JSON.stringify(formData)
            });
            await loadData();
            setShowPopup(false);
        } catch (err) { console.error("Update failed:", err); }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await fetch(`http://localhost:3500/users/gymcalendar/${eventId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            await loadData();
        } catch (err) { console.error("Delete failed:", err); }
    };

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const openAdd = () => {
        setIsEditing(false);
        setSelectedEvent(null);
        setFormData({ title: "", date: "", time: "" });
        setShowPopup(true);
    };

    const openEdit = (event) => {
        setIsEditing(true);
        setSelectedEvent(event);
        setFormData({ title: event.title, date: event.date?.split("T")[0] || "", time: event.time || "" });
        setShowPopup(true);
    };

    return (
        <div className="gc-page">
            <div className="gc-header">
                <h1 className="gc-title">Gym Calendar</h1>
                <p className="gc-sub">Your workouts and gym events at a glance</p>
            </div>

            <div className="gc-layout">

                {/* Calendar */}
                <div className="gc-card gc-calendar-card">
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        displayEventTime={false}
                        events={events}
                        height="100%"
                    />
                </div>

                {/* Side panels */}
                <div className="gc-side">

                    <div className="gc-card gc-events-card">
                        <div className="gc-card-head">
                            <span className="gc-card-label">Your Events</span>
                            <span className="gc-count">{userEvents.length}</span>
                        </div>

                        <ul className="gc-event-list">
                            {userEvents.length === 0 && (
                                <li className="gc-empty">No events yet.</li>
                            )}
                            {userEvents.map(event => (
                                <li key={event._id} className="gc-event-item">
                                    <div className="gc-event-info">
                                        <span className="gc-event-date">{formatDate(event.date)}</span>
                                        <span className="gc-event-title">{event.title}</span>
                                    </div>
                                    <div className="gc-event-actions">
                                        <button className="gc-btn-ghost" onClick={() => openEdit(event)}>Edit</button>
                                        <button className="gc-btn-ghost danger" onClick={() => handleDeleteEvent(event._id)}>Del</button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <button className="gc-btn-primary full" onClick={openAdd}>+ Add Event</button>
                    </div>

                    <div className="gc-card gc-gym-card">
                        <div className="gc-card-head">
                            <span className="gc-card-label">Gym Events</span>
                            <span className="gc-count">{gymEvents.length}</span>
                        </div>

                        <ul className="gc-event-list">
                            {gymEvents.length === 0 && (
                                <li className="gc-empty">No gym events scheduled.</li>
                            )}
                            {gymEvents.map(event => (
                                <li key={event._id} className="gc-event-item simple">
                                    <span className="gc-event-date">{formatDate(event.date)}</span>
                                    {event.time && <span className="gc-event-time">{event.time}</span>}
                                    <span className="gc-event-title">{event.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>

            {/* Modal */}
            {showPopup && (
                <div className="gc-modal-overlay" onClick={() => setShowPopup(false)}>
                    <div className="gc-modal" onClick={e => e.stopPropagation()}>
                        <p className="gc-modal-title">{isEditing ? "Edit Event" : "Add Event"}</p>
                        <div className="gc-modal-form">
                            <input
                                className="gc-modal-input"
                                type="text"
                                placeholder="Event title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                            <div className="gc-modal-row">
                                <div className="gc-modal-field">
                                    <label className="gc-field-label">Date</label>
                                    <input
                                        className="gc-modal-input"
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="gc-modal-field">
                                    <label className="gc-field-label">Time</label>
                                    <input
                                        className="gc-modal-input"
                                        type="time"
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="gc-modal-actions">
                            <button className="gc-btn-ghost" onClick={() => { setShowPopup(false); setSelectedEvent(null); }}>Cancel</button>
                            <button className="gc-btn-primary" onClick={async () => {
                                isEditing ? await handleEditEvent() : await handleAddEvent();
                                setShowPopup(false);
                                setSelectedEvent(null);
                            }}>
                                {isEditing ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Routine;
