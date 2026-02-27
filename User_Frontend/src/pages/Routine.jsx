import React, { useState, useEffect} from 'react';
import '../assets/GymCalendar.css'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function Routine(){
    return(
        <div className="page">
            <h1>Gym Calendar</h1>

            <div className="gym-calendar-container-box">
                {/* LEFT SIDE – CALENDAR */}
                <div className="calendar-container">
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={[
                    { title: "Deadlift Competition", date: "2026-02-25" },
                    { title: "Appointment", date: "2026-02-26" },
                    { title: "Register", date: "2026-02-27" },
                    { title: "Meet Gym Baddie", date: "2026-02-28" },
                    ]}
                />
                </div>

                {/* RIGHT SIDE – EVENTS */}
                <div className="calendar-events-container">

                <div className="calendar-user-events card">
                    <h2>Your Events</h2>

                    <ul className="calendar-event-list">
                    <li className="calendar-event-item">
                        <span>Feb 26 – Appointment</span>
                        <div className="calendar-event-actions">
                        <button className="calendar-btn-outline">Edit</button>
                        <button className="calendar-btn-outline">Delete</button>
                        </div>
                    </li>

                    <li className="calendar-event-item">
                        <span>Feb 27 – Register</span>
                        <div className="calendar-event-actions">
                        <button className="calendar-btn-outline">Edit</button>
                        <button className="calendar-btn-outline">Delete</button>
                        </div>
                    </li>

                    <li className="calendar-event-item">
                        <span>Feb 28 – Meet Gym Baddie</span>
                        <div className="calendar-event-actions">
                        <button className="calendar-btn-outline">Edit</button>
                        <button className="calendar-btn-outline">Delete</button>
                        </div>
                    </li>
                    </ul>

                    <button className="calendar-btn-primary full-width">
                    Add Event
                    </button>
                </div>

                <div className="gym-events card">
                    <h2>Gym Events</h2>

                    <ul className="calendar-event-list">
                    <li className="calendar-event-item simple">
                        <span>Feb 25 – Deadlift Competition</span>
                    </li>
                    </ul>
                </div>

                </div>
            </div>
        </div>
    )
}

export default Routine;