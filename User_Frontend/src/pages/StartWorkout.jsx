import React, { useState, useEffect} from 'react';
import '../assets/StartWorkout.css';
import { Link } from 'react-router-dom';

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


function StartWorkout(){

    const [routines, setRoutines] = useState(["Full Body Blast", "Upper Body Strength", "Leg Day Power"]);
    return(
            <div className='page'>
                <h1> Start Workout </h1>
                <div>
                    <div className="startworkout-container-box">
                        <div className="first-box">
                            <h2>Your Routines</h2>

                            <ul className="routine-list">
                                {routines.map((routine, index) => (
                                    <li key={index} className="routine-item">
                                        <span>{routine}</span>
                                        <div className="routine-actions">
                                            <Link to={`/startworkout/edit`}><button className="btn-outline">Edit</button></Link>
                                            <button className="btn-outline">Delete</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <Link to={"/startworkout/add"}><button className="btn-primary full-width">
                             Add New Routine
                            </button></Link>

                        </div>

                        <div className="middle-box">
                            <h2>Title of Workout</h2>
                            <p className="workout-description">
                            Description Placeholder
                            </p>

                            <h3 className="section-label">Exercises</h3>

                            <ul className="exercise-list">
                            <li className="exercise-item">
                                <span>Name</span>
                                <span>Category</span>
                                <span>No.</span>
                            </li>
                            </ul>
                        </div>

                        <div className="last-box">
                            <h2>Workout Overview</h2>

                            <div className="chart-container">
                            <Doughnut
                                data={{
                                labels: ["Chest", "Back", "Shoulders", "Arms", "Core/Abs", "Legs"],
                                datasets: [{
                                    data: [5, 10, 3, 6, 8, 9],
                                    backgroundColor: ["blue", "red", "yellow", "green", "violet", "orange"],
                                    borderWidth: 0,
                                }],
                                }}
                                options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                }}
                            />
                            </div>

                            <div className="workout-stats">
                            <p><strong>Target:</strong> Full Body</p>
                            <p><strong>No. of workouts:</strong> 12</p>
                            <p><strong>Last Time Used:</strong> Yesterday</p>
                            </div>

                            <Link to={"/startworkout/start"}><button className="btn-primary full-width">
                            Start Workout
                            </button></Link>
                        </div>

                        </div>
                </div>
        </div>
    )
}
export default StartWorkout;