import React, { useState, useEffect} from 'react';
import '../assets/Dashboard.css'
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { ArcElement } from "chart.js";
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
    return(
       <div className='dashboard-page'>
            <h1> Dashboard </h1>
            <p> Welcome Back <span> Username</span></p>
            <p> Overview </p>
            <div className='dashboard-container-box'>
                <div className='dashboard-box'> 
                    <div>
                        <p> Level 7</p>
                        <p> TOTAL EXP : 360 EXP</p>
                    </div>
                </div>
                <div className='dashboard-box'>
                    <div> <p> Current Streak </p></div>
                    <div> <p> Membership: </p><p> Basic Membership</p> <p> 30 days</p></div>
                    <div> <p> Recent Achievements</p> <p> Achivement Title </p></div>

                </div>
                <div className='dashboard-box'> <p> Recent notifications </p> <ul> <li> Someone added</li> <li> You are registered</li></ul> </div>
            </div>


            <p> Your Activity </p>
            <div className='dashboard-container-box'>
                <div>
                <h2> Your Week </h2>
                <div className='dashboard-big-box-progress'>
                    <Bar
                        data={{
                            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], // Sunday first
                            datasets: [
                            {
                                label: "No. of Workouts",
                                data: [150, 200, 300, 400, 250, 350, 400, ], 
                                backgroundColor: ["gray", "red", "blue", "green", "orange", "purple"], // one color per day
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
                                max: 500, // optional: set max for y-axis
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
                            }],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false, // this allows the chart to fit the container
                        }}
                        />

                </div>
                </div>
            </div>
             <p>  </p>
            <div className='dashboard-container-box'>
                <div className='dashboard-big-box-progress'></div>
                <div className='dashboard-big-box-progress'></div>
            </div>
            <p> Trainers  Recommender For You</p>
            <div className='dashboard-container-box'>
                <div className='dashboard-big-box'></div>
            </div>
            <p> Recommended Food For You</p>
            <div className='dashboard-container-box'>
                <div className='dashboard-big-box'></div>

            </div>
       </div>
    )
}

export default Dashboard;