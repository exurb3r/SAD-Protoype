import React, { useState, useEffect } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import '../assets/GymStatus.css';

function GymLoginHistory(){

    const [memberships,setMemberships] = useState([]);
    const [logs,setLogs] = useState([]);
    const [events,setEvents] = useState([]);

    const membership = memberships[0] || {}; 

    useEffect(()=>{

        const fetchData = async () => {

            try{

                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:3500/users/gymhistory",{
                    headers:{
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await res.json();

                setMemberships(data.memberships || []);
                setLogs(data.logs || []);
                setEvents(data.calendarEvents || []);

            }catch(err){
                console.error(err);
            }

        }

        fetchData();

    },[]);

    return(
       <div className='gym-history-page'>

            <h1> My Gym Status </h1>
            <p> My Gym Membership Status</p>

            <div className='gym-status-container-box'>
                <div className='gym-status-card'>
                    <div className='gym-badge-holder'></div>

                    <div className='membership-info'>
                        <p className='membership-rank'>
                            {membership.category || "No Membership"}
                        </p>
                    </div>
                </div>

                <div className='gym-status-card'>
                    <div className='membership-info'>
                        <p className='branch-location'>
                            Branch: {membership.branch || "N/A"}
                        </p>
                    </div>
                </div>

                <div className='gym-status-card'>
                    <div className='membership-info'>
                        <p className='day-started'>
                            Started: {membership.startDate ?
                            new Date(membership.startDate).toLocaleDateString() : "N/A"}
                        </p>
                    </div>
                </div>

                <div className='gym-status-card'>
                    <div className='membership-info'>
                        <p className='membership-expiry'>
                            Expiry: {membership.expiryDate ?
                            new Date(membership.expiryDate).toLocaleDateString() : "N/A"}
                        </p>
                    </div>
                </div>

                <div className='gym-status-card'>
                    <div className='membership-info'>
                        <p className='remaining-days'>
                            Remaining Days: {membership.remainingDays ?? "N/A"}
                        </p>
                    </div>
                </div>

            </div>

            <div className="gym-history-calendar-container-box">

                <div className="gym-history-calendar-container">

                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        events={events}
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
                                        <th>Branch</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {logs.map((log,index)=>(
                                        <tr key={index}>
                                            <td>
                                                {new Date(log.date).toLocaleDateString()}
                                            </td>
                                            <td>{log.timeIn}</td>
                                            <td>{log.timeOut}</td>
                                            <td>{log.branch}</td>
                                        </tr>
                                    ))}
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