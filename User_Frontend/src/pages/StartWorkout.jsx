import React, { useState, useEffect } from 'react';
import '../assets/StartWorkout.css';
import { Link, useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function StartWorkout() {
    const navigate = useNavigate();
    const [routineList, setRoutineList] = useState([]);
    const [selectedRoutine, setSelectedRoutine] = useState(null);

    function handleSelectRoutine(routine) {
        setSelectedRoutine(routine);
    }

    function start() {
        if (selectedRoutine === null) {
            alert("Select a workout first");
        } else {
            navigate(`/startworkout/start/${selectedRoutine?._id}`);
        }
    }

    async function fetchRoutines() {
        try {
            const response = await fetch("http://localhost:3500/users/startworkout/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();
            setRoutineList(data.routines);
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteSelectedRoutine(routineId) {
        const confirmed = confirm("Are you sure you want to delete this workout?");
        if (confirmed) {
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
                setRoutineList(data.routines);
                if (selectedRoutine?._id === routineId) setSelectedRoutine(null);
            } catch (err) {
                console.error(err);
            }
        }
    }

    useEffect(() => { fetchRoutines(); }, []);

    const categories = ["Chest", "Back", "Shoulders", "Arms", "Core/Abs", "Legs"];
    const doughnutCounts = selectedRoutine
        ? categories.map(cat => selectedRoutine.exercises.filter(e => e.category === cat).length)
        : [0, 0, 0, 0, 0, 0];

    const isEmpty = !selectedRoutine || doughnutCounts.every(v => v === 0);

    return (
        <div className="sw-page">
            <div className="sw-header">
                <h1 className="sw-title">Start Workout</h1>
                <p className="sw-sub">Select a routine and get moving</p>
            </div>

            <div className="sw-layout">

                {/* Routines list */}
                <div className="sw-panel">
                    <div className="sw-panel-head">
                        <span className="sw-panel-title">Your Routines</span>
                        <span className="sw-count">{routineList.length}</span>
                    </div>

                    <ul className="sw-routine-list">
                        {routineList.length === 0 && (
                            <li className="sw-empty">No routines yet. Add one below.</li>
                        )}
                        {routineList.map((routine) => (
                            <li
                                key={routine._id}
                                className={`sw-routine-item ${selectedRoutine?._id === routine._id ? 'selected' : ''}`}
                                onClick={() => handleSelectRoutine(routine)}
                            >
                                <div className="sw-routine-info">
                                    <span className="sw-routine-name">{routine.routineName}</span>
                                    <span className="sw-routine-meta">{routine.exercises?.length || 0} exercises</span>
                                </div>
                                <div className="sw-routine-actions" onClick={e => e.stopPropagation()}>
                                    <Link to={`/startworkout/edit/${routine._id}`}>
                                        <button className="sw-btn-ghost">Edit</button>
                                    </Link>
                                    <button className="sw-btn-ghost danger" onClick={() => deleteSelectedRoutine(routine._id)}>Del</button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <Link to="/startworkout/add" className="sw-add-link">
                        <button className="sw-btn-primary full">+ Add New Routine</button>
                    </Link>
                </div>

                {/* Exercise preview */}
                <div className="sw-panel">
                    <div className="sw-panel-head">
                        <span className="sw-panel-title">
                            {selectedRoutine ? selectedRoutine.routineName : "Select a Routine"}
                        </span>
                        {selectedRoutine && (
                            <span className="sw-count">{selectedRoutine.exercises.length} ex</span>
                        )}
                    </div>

                    {!selectedRoutine && (
                        <div className="sw-placeholder">
                            <div className="sw-placeholder-icon">↖</div>
                            <p>Pick a routine from the list to preview its exercises.</p>
                        </div>
                    )}

                    {selectedRoutine && (
                        <>
                            <div className="sw-exercise-header">
                                <span>Exercise</span>
                                <span>Category</span>
                                <span>Reps</span>
                            </div>
                            <ul className="sw-exercise-list">
                                {selectedRoutine.exercises.map((ex, i) => (
                                    <li key={i} className="sw-exercise-item">
                                        <span className="sw-ex-name">{ex.nameOfexercise}</span>
                                        <span className="sw-ex-cat">{ex.category}</span>
                                        <span className="sw-ex-reps">{ex.reps}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                {/* Overview */}
                <div className="sw-panel">
                    <div className="sw-panel-head">
                        <span className="sw-panel-title">Overview</span>
                    </div>

                    <div className="sw-chart-wrap">
                        {isEmpty ? (
                            <div className="sw-chart-empty">
                                <p>Select a routine to see its muscle split</p>
                            </div>
                        ) : (
                            <Doughnut
                                data={{
                                    labels: categories,
                                    datasets: [{
                                        data: doughnutCounts,
                                        backgroundColor: ["#dc2626","#f87171","#ffffff","#9ca3af","#4b4b4b","#1f1f1f"],
                                        borderWidth: 0,
                                        borderRadius: 4,
                                    }],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: { color: '#888', font: { size: 11 }, padding: 10, boxWidth: 10 }
                                        }
                                    },
                                    cutout: '65%',
                                }}
                            />
                        )}
                    </div>

                    {selectedRoutine && (
                        <div className="sw-stats">
                            <div className="sw-stat-row">
                                <span>Exercises</span>
                                <span>{selectedRoutine.exercises.length}</span>
                            </div>
                            <div className="sw-stat-row">
                                <span>Day Assigned</span>
                                <span>{selectedRoutine.dayAssigned || "—"}</span>
                            </div>
                            <div className="sw-stat-row">
                                <span>Time Assigned</span>
                                <span>{selectedRoutine.timeAssigned || "—"}</span>
                            </div>
                        </div>
                    )}

                    <button
                        className={`sw-btn-primary full sw-start-btn ${!selectedRoutine ? 'disabled' : ''}`}
                        onClick={start}
                        disabled={!selectedRoutine}
                    >
                        Start Workout →
                    </button>
                </div>

            </div>
        </div>
    );
}

export default StartWorkout;
