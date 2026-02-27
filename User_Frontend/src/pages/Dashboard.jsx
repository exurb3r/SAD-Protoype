import React, { useState, useEffect} from 'react';
import '../assets/Dashboard.css'
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { ArcElement } from "chart.js";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Dashboard(){

    const percentage = 60
    return(
       <div className='dashboard-page'>
            <h1> Dashboard </h1>
            <p> Welcome Back <span> Username</span></p>
            <p> Overview </p>
            <div className='dashboard-container-box'>
                <div className='dashboard-upper-box-firstbox'> 
                    <div>
                        <div className='lvl-holder'>
                            <CircularProgressbar value={70} text={`Lvl 7`} />
                        </div>
                        <p> TOTAL EXP : 360 EXP</p>
                    </div>
                </div>
                <div className='dashboard-upper-box-middlebox'>
                    <div className='upper-section' >
                        <div className='dashboard-inner-first-box-streak'> <p> Current Streak </p></div>
                        <div className='dashboard-inner-first-box-membership'>  <p> Membership: </p>
                                                                                <p> Basic Membership</p> 
                                                                                <p> 30 days</p></div>
                    </div>
                    <div className='dashboard-inner-first-box-achievements'><p> Recent Achievements</p>
                                                                            <p> Achivement Title </p>
                                                                            <p> Achievement Title</p> 
                                                                            <p> Achievement Title</p>
                    </div>
                </div>
                <div className='dashboard-upper-box-lastbox'> <p>Previous Workout Preview </p> 
                                                        <ul> 
                                                            <li> No. of Workouts</li> 
                                                            <li> Duration</li>
                                                            <li> Focus : Arms, Legs</li>
                                                            <li> Exp Gained</li>
                                                        </ul>
                </div>
            </div>


            <p> Your Activity </p>
            <div className='dashboard-container-box'>
                <div>
                <h2> Your Week </h2>
                <div className='dashboard-big-box-progress'>
                    <Bar
                        data={{
                            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                            datasets: [
                            {
                                label: "No. of Workouts",
                                data: [150, 200, 300, 400, 250, 350, 400, ], 
                                backgroundColor: ["#4d4dff", "#4d4dff", "#4d4dff", "#4d4dff", "#4d4dff", "#4d4dff"],
                                borderRadius: 5, 
                                borderWidth: 0,
                            },
                            ],
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                            legend: {
                                display: true,
                            },
                            },
                            scales: {
                            y: {
                                beginAtZero: true,
                                max: 500,
                            },
                            },
                        }}
                        />
                </div>
                </div>
                <div>
                <h2> Your Workout Distribution </h2>
                <div className='dashboard-big-box-progress-pie'>
                    <Doughnut
                        data={{
                            labels: ["Chest", "Back", "Shoulders", "Arms", "Core/Abs", "Legs"],
                            datasets: [{
                                data: [200, 300, 400, 150, 100, 250],
                                backgroundColor: ["red", "blue", "green", "orange", "purple", "cyan"],
                                borderRadius: 5,
                                borderWidth: 0,
                                barThickness: 50,

                            }],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false, 
                        }}
                        />

                </div>
                </div>
            </div>
            <p> Recent Notifications </p>
            <div className='dashboard-notif-box'>
                <div className='notif-div'></div>
                <div className='notif-div'></div>
                <div className='notif-div'></div>
            </div>
       </div>
    )
}

export default Dashboard;