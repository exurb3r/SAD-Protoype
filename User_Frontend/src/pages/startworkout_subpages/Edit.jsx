import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Tooltip, Legend } from "chart.js";
import "../../assets/Add.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORIES = ["Chest", "Back", "Shoulders", "Arms", "Core/Abs", "Legs"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function EditWorkout() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [routineName, setRoutineName] = useState("");
    const [exerciseName, setExerciseName] = useState("");
    const [category, setCategory] = useState("Chest");
    const [reps, setReps] = useState("");
    const [exercises, setExercises] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editName, setEditName] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editReps, setEditReps] = useState("");
    const [dayAssigned, setDayAssigned] = useState("");
    const [timeAssigned, setTimeAssigned] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchRoutine(); }, [id]);

    async function fetchRoutine() {
        try {
            const res = await fetch(`http://localhost:3500/users/startworkout/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();
            if (data.routine) {
                setRoutineName(data.routine.routineName);
                setExercises(data.routine.exercises || []);
                setDayAssigned(data.routine.dayAssigned || "");
                setTimeAssigned(data.routine.timeAssigned || "");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function handleAddExercise(e) {
        e.preventDefault();
        if (!exerciseName || !reps) return;
        setExercises([...exercises, { nameOfexercise: exerciseName, category, reps: Number(reps) }]);
        setExerciseName("");
        setReps("");
    }

    function handleDelete(index) {
        setExercises(exercises.filter((_, i) => i !== index));
    }

    function handleCopy(index) {
        setExercises([...exercises, { ...exercises[index] }]);
    }

    function handleUpdate(index) {
        const updated = [...exercises];
        updated[index] = { nameOfexercise: editName, category: editCategory, reps: Number(editReps) };
        setExercises(updated);
        setEditingIndex(null);
    }

    function returnToPreviousStage() {
        const confirmation = confirm("Go back to previous page?");
        if (confirmation) navigate('/startworkout');
    }

    async function updateRoutine() {
        if (!routineName || exercises.length === 0) {
            alert("Please add a routine name and at least one exercise.");
            return;
        }
        try {
            await fetch(`http://localhost:3500/users/startworkout/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ routineName, exercises, dayAssigned, timeAssigned })
            });
            navigate("/startworkout");
        } catch (err) {
            console.error(err);
        }
    }

    const focusAreas = [...new Set(exercises.map(e => e.category))];
    const doughnutCounts = CATEGORIES.map(cat => exercises.filter(e => e.category === cat).length);
    const isEmpty = doughnutCounts.every(v => v === 0);

    if (loading) {
        return (
            <div className="aw-page">
                <p style={{ color: '#555', fontSize: '13px' }}>Loading routine...</p>
            </div>
        );
    }

    return (
        <div className="aw-page">

            {/* Top bar */}
            <div className="aw-topbar">
                <button className="aw-back-btn" onClick={returnToPreviousStage}>← Back</button>
                <div>
                    <h1 className="aw-title">Edit Workout</h1>
                    <p className="aw-sub">Update your routine and save changes</p>
                </div>
            </div>

            <div className="aw-layout">

                {/* Left — form + list */}
                <div className="aw-left">

                    {/* Meta row */}
                    <div className="aw-card">
                        <p className="aw-card-label">Routine Details</p>
                        <input
                            className="aw-input full"
                            type="text"
                            placeholder="Routine name (e.g. Push Day A)"
                            value={routineName}
                            onChange={e => setRoutineName(e.target.value)}
                        />
                        <div className="aw-meta-row">
                            <div className="aw-field">
                                <label className="aw-field-label">Day</label>
                                <select className="aw-select" value={dayAssigned} onChange={e => setDayAssigned(e.target.value)}>
                                    <option value="">None</option>
                                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="aw-field">
                                <label className="aw-field-label">Time</label>
                                <input className="aw-input" type="time" value={timeAssigned} onChange={e => setTimeAssigned(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Add exercise form */}
                    <div className="aw-card">
                        <p className="aw-card-label">Add Exercise</p>
                        <form onSubmit={handleAddExercise} className="aw-exercise-form">
                            <input
                                className="aw-input"
                                type="text"
                                placeholder="Exercise name"
                                value={exerciseName}
                                onChange={e => setExerciseName(e.target.value)}
                            />
                            <select className="aw-select" value={category} onChange={e => setCategory(e.target.value)}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <input
                                className="aw-input aw-reps"
                                type="number"
                                placeholder="Sets / Reps"
                                value={reps}
                                onChange={e => setReps(e.target.value)}
                                min="0"
                            />
                            <button type="submit" className="aw-btn-primary">+ Add</button>
                        </form>
                    </div>

                    {/* Exercise list */}
                    <div className="aw-card aw-list-card">
                        <div className="aw-list-header">
                            <p className="aw-card-label">Exercises</p>
                            <span className="aw-count">{exercises.length}</span>
                        </div>

                        {exercises.length === 0 && (
                            <p className="aw-empty">No exercises yet. Add one above.</p>
                        )}

                        <ul className="aw-exercise-list">
                            {exercises.map((ex, index) => (
                                <li key={index} className="aw-exercise-item">
                                    {editingIndex === index ? (
                                        <div className="aw-edit-row">
                                            <input className="aw-input" value={editName} onChange={e => setEditName(e.target.value)} />
                                            <select className="aw-select" value={editCategory} onChange={e => setEditCategory(e.target.value)}>
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <input className="aw-input aw-reps" type="number" value={editReps} onChange={e => setEditReps(e.target.value)} min="0" />
                                            <div className="aw-actions">
                                                <button className="aw-btn-ghost" onClick={() => setEditingIndex(null)}>Cancel</button>
                                                <button className="aw-btn-ghost confirm" onClick={() => handleUpdate(index)}>Save</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aw-ex-row">
                                            <div className="aw-ex-info">
                                                <span className="aw-ex-name">{ex.nameOfexercise}</span>
                                                <div className="aw-ex-tags">
                                                    <span className="aw-tag cat">{ex.category}</span>
                                                    <span className="aw-tag reps">{ex.reps} reps</span>
                                                </div>
                                            </div>
                                            <div className="aw-actions">
                                                <button className="aw-btn-ghost" onClick={() => { setEditingIndex(index); setEditName(ex.nameOfexercise); setEditCategory(ex.category); setEditReps(ex.reps); }}>Edit</button>
                                                <button className="aw-btn-ghost" onClick={() => handleCopy(index)}>Copy</button>
                                                <button className="aw-btn-ghost danger" onClick={() => handleDelete(index)}>Del</button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right — overview */}
                <div className="aw-right">
                    <div className="aw-card aw-overview-card">
                        <p className="aw-card-label">Overview</p>

                        <div className="aw-chart-wrap">
                            {isEmpty ? (
                                <div className="aw-chart-empty">
                                    <p>Add exercises to see your muscle split</p>
                                </div>
                            ) : (
                                <Doughnut
                                    data={{
                                        labels: CATEGORIES,
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

                        <div className="aw-summary">
                            <div className="aw-summary-row">
                                <span>Routine</span>
                                <span>{routineName || "—"}</span>
                            </div>
                            <div className="aw-summary-row">
                                <span>Exercises</span>
                                <span>{exercises.length}</span>
                            </div>
                            <div className="aw-summary-row">
                                <span>Day</span>
                                <span>{dayAssigned || "—"}</span>
                            </div>
                            <div className="aw-summary-row">
                                <span>Focus</span>
                                <span>{focusAreas.length > 0 ? focusAreas.join(", ") : "—"}</span>
                            </div>
                        </div>

                        <button
                            className={`aw-btn-primary full aw-save-btn ${(!routineName || exercises.length === 0) ? 'disabled' : ''}`}
                            onClick={updateRoutine}
                            disabled={!routineName || exercises.length === 0}
                        >
                            Update Routine
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default EditWorkout;
