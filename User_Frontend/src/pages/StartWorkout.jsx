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

    const [routineList, setRoutineList] = useState([]);
    const [selectedRoutine, setSelectedRoutine] = useState(null);

    function handleSelectRoutine(routine) {
        setSelectedRoutine(routine);
    }


    async function handleSaveRoutine() {
        try {
            const response = await fetch("http://localhost:3500/users/startworkout/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
            });

            const data = await response.json();
            console.log(data.routines);
            setRoutineList(data.routines);
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteSelectedRoutine(routineId) {
        try {
            const response = await fetch(`http://localhost:3500/users/startworkout/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ routineId })
            });

            const data = await response.json();
            console.log(data.routines);
            setRoutineList(data.routines);
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        handleSaveRoutine();
    }, []);

    const [routines, setRoutines] = useState(["Full Body Blast", "Upper Body Strength", "Leg Day Power"]);
    return(
            <div className='page'>
                <h1> Start Workout </h1>
                <div>
                    <div className="startworkout-container-box">
                        <div className="first-box">
                            <h2>Your Routines</h2>

                            <ul className="routine-list">
                                {routineList.map((routine) => (
                                    <li key={routine._id} className="routine-item" >
                                        <span key={routine._id}  onClick={() => handleSelectRoutine(routine)}>{routine.routineName}</span>
                                        <div className="routine-actions">
                                            <Link to={`/startworkout/edit/${routine._id}`} ><button className="btn-outline">Edit</button></Link>
                                            <button className="btn-outline" onClick={() => deleteSelectedRoutine(routine._id)} >Delete</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <Link to={"/startworkout/add"}><button className="btn-primary full-width">
                                Add New Routine
                            </button></Link>

                        </div>
                        <div className="middle-box">
                            <h2>{selectedRoutine ? selectedRoutine.routineName : "Select a Routine"}</h2>
                            <p className="workout-description">
                                {selectedRoutine ? `This workout has ${selectedRoutine.exercises.length} exercises.` : "No routine selected."}
                            </p>

                            <h3 className="section-label">Exercises</h3>
                            <ul className="exercise-list">
                                <li className="exercise-item">
                                <span>Name</span>
                                <span>Category</span>
                                <span>No.</span>
                                </li>

                                {selectedRoutine && selectedRoutine.exercises.map((ex, index) => (
                                <li key={index} className="exercise-item">
                                    <span>{ex.nameOfexercise}</span>
                                    <span>{ex.category}</span>
                                    <span>{ex.reps}</span>
                                </li>
                                ))}
                            </ul>
                        </div>

                        <div className="last-box">
                            <h2>Workout Overview</h2>

                            <div className="chart-container">
                                <Doughnut
                                    data={{
                                    labels: ["Chest", "Back", "Shoulders", "Arms", "Core/Abs", "Legs"],
                                    datasets: [{
                                        data: selectedRoutine
                                        ? [
                                            selectedRoutine.exercises.filter(e => e.category === "Chest").length,
                                            selectedRoutine.exercises.filter(e => e.category === "Back").length,
                                            selectedRoutine.exercises.filter(e => e.category === "Shoulders").length,
                                            selectedRoutine.exercises.filter(e => e.category === "Arms").length,
                                            selectedRoutine.exercises.filter(e => e.category === "Core/Abs").length,
                                            selectedRoutine.exercises.filter(e => e.category === "Legs").length,
                                            ]
                                        : [0,0,0,0,0,0],
                                        backgroundColor: ["blue", "red", "yellow", "green", "violet", "orange"],
                                        borderWidth: 0,
                                    }],
                                    }}
                                    options={{ responsive: true, maintainAspectRatio: false }}
                                />
                                </div>
                            <div className="workout-stats">
                                {selectedRoutine && (
                                    <>
                                    <p><strong>No. of exercises:</strong> {selectedRoutine.exercises.length}</p>
                                    <p><strong>Day Assigned:</strong> {selectedRoutine.dayAssigned || "N/A"}</p>
                                    <p><strong>Time Assigned:</strong> {selectedRoutine.timeAssigned || "N/A"}</p>
                                    </>
                                )}
                            </div>

                            <Link to={`/startworkout/start/${selectedRoutine?._id}`}><button className="btn-primary full-width">
                                Start Workout
                            </button></Link>
                        </div>

                        </div>
                </div>
        </div>
    )
}
export default StartWorkout;