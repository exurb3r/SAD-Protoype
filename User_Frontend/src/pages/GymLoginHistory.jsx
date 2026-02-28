import React, { useState, useEffect} from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import '../assets/GymStatus.css';
function GymLoginHistory(){
    return(
       <div className='gym-history-page'>
            <h1> My Gym Status </h1>
            <p> My Gym Membership Status</p>
            <div className='gym-status-container-box'>
                <div className='gym-status-card'><div className='gym-badge-holder'></div> <p className='membership-rank'> Membership </p> </div>
                <div className='gym-status-card'> <p className='branch-location'> Branch: General Luna</p></div>
                <div className='gym-status-card'> <p className='day-started'> Started: Feb 25, 2026</p></div>
                <div className='gym-status-card'> <p className='membership-expiry'> Expiry: Feb 25, 2027</p></div>
                <div className='gym-status-card'> <p className='remaining-days'> Remaining Days: 365</p></div>
            </div>
            <div className="gym-history-calendar-container-box">
                <div className="gym-history-calendar-container">
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        events={[
                            { title: "Login", date: "2026-02-25" },
                        ]}
                    />
                </div>
                <div className="calendar-events-container">
                    <div className="calendar-card">
                        <h2>Gym Login History</h2>

                        <div className="login-history-table-wrapper">
                            <table className="login-history-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time In</th>
                                        <th>Time Out</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>02-25-2026</td>
                                        <td>1:30 PM</td>
                                        <td>3:30 PM</td>
                                    </tr>
                                    <tr>
                                        <td>02-24-2026</td>
                                        <td>2:00 PM</td>
                                        <td>4:10 PM</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
       </div>
    )
}

export default GymLoginHistory;