import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../assets/StartWorkout.css";

function StartingWorkout() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [routineName, setRoutineName] = useState("");
    const [exercises, setExercises] = useState([]);
    const [completedExercises, setCompletedExercises] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let interval = null;
        if (isRunning && !isPaused) {
            interval = setInterval(() => setSeconds(prev => prev + 1), 1000);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [isRunning, isPaused]);

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
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function formatTime(s) {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
        return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    }

    function handleStart() {
        setSeconds(0);
        setCompletedExercises([]);
        setIsRunning(true);
        setIsPaused(false);
    }

    function handlePause()  { setIsPaused(true); }
    function handleResume() { setIsPaused(false); }

    async function handleDone() {
        if (!isRunning || completedExercises.length === 0) return;
        if (!confirm("Submit this workout?")) return;

        setIsRunning(false);
        setIsPaused(false);

        try {
            const response = await fetch("http://localhost:3500/users/startworkout/finishworkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    routineId: id,
                    timeSpent: seconds,
                    numberOfWorkout: exercises.length,
                    numberOfFinished: completedExercises.length,
                    workoutList: completedExercises.map(i => exercises[i]),
                }),
            });
            const data = await response.json();
            if (!response.ok) { alert(data.message || "Failed to record workout."); return; }
            alert(`Workout Complete!\n\n+${data.expGained} XP  ·  ${data.completionRate}% done  ·  x${data.multiplier}${data.leveledUp ? "\n\n🎉 Level Up!" : ""}`);
            navigate("/startworkout");
        } catch (err) {
            console.error(err);
            alert("Server error.");
        }
    }

    function toggleExercise(index) {
        if (!isRunning || isPaused) return;
        setCompletedExercises(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    }

    const progressPercent = exercises.length === 0
        ? 0
        : Math.round((completedExercises.length / exercises.length) * 100);

    const workoutState = !isRunning ? "idle" : isPaused ? "paused" : "running";
    const canInteract = isRunning && !isPaused;

    if (loading) {
        return (
            <div className="sw-page" style={{ alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#555", fontSize: "13px" }}>Loading routine...</p>
            </div>
        );
    }

    return (
        <div className="sw-page">
            {/* Header */}
            <div className="sw-header">
                <div className="sw-header-row">
                    <button
                        className="sw-btn-ghost"
                        onClick={() => { if (confirm("Leave this workout?")) navigate("/startworkout"); }}
                    >
                        ← Back
                    </button>
                    <div>
                        <h1 className="sw-title">{routineName || "Workout"}</h1>
                        <p className="sw-sub">{exercises.length} exercises</p>
                    </div>
                    <span className={`sw-status-badge ${workoutState}`} style={{ marginLeft: "auto" }}>
                        {workoutState === "idle" ? "Not started" : workoutState === "paused" ? "Paused" : "● Live"}
                    </span>
                </div>
            </div>

            <div className="sw-layout two-col">

                {/* Exercise checklist */}
                <div className="sw-panel">
                    <div className="sw-panel-head">
                        <span className="sw-panel-title">Exercises</span>
                        <span className="sw-count">{completedExercises.length} / {exercises.length}</span>
                    </div>

                    <div className="sw-progress-wrap">
                        <div className="sw-progress-bar">
                            <div className="sw-progress-fill" style={{ width: `${progressPercent}%` }} />
                        </div>
                        <span className="sw-progress-label">{progressPercent}%</span>
                    </div>

                    <div className="sw-exercise-header">
                        <span></span>
                        <span>Exercise</span>
                        <span>Category</span>
                        <span>Reps</span>
                    </div>

                    <ul className="sw-exercise-list">
                        {exercises.map((ex, index) => {
                            const done = completedExercises.includes(index);
                            return (
                                <li
                                    key={index}
                                    className={`sw-exercise-item ${done ? "completed" : ""} ${!canInteract ? "locked" : ""}`}
                                    onClick={() => toggleExercise(index)}
                                    title={!canInteract ? "Start the workout to check off exercises" : ""}
                                >
                                    <span className="sw-check-box">{done ? "✓" : ""}</span>
                                    <span className={`sw-ex-name ${done ? "done" : ""}`}>{ex.nameOfexercise}</span>
                                    <span className="sw-ex-cat">{ex.category}</span>
                                    <span className="sw-ex-reps">{ex.reps} reps</span>
                                </li>
                            );
                        })}
                    </ul>

                    {!isRunning && (
                        <p className="sw-hint">Start the workout to check off exercises</p>
                    )}
                    {isPaused && (
                        <p className="sw-hint">Resume to continue</p>
                    )}
                </div>

                {/* Controls */}
                <div className="sw-panel sw-controls-panel">
                    <div className="sw-panel-head">
                        <span className="sw-panel-title">Timer</span>
                    </div>

                    <div className="sw-timer-display">
                        <span className="sw-timer-value">{formatTime(seconds)}</span>
                        <span className="sw-timer-sub">elapsed</span>
                    </div>

                    <div className="sw-progress-wrap">
                        <div className="sw-progress-bar">
                            <div className="sw-progress-fill" style={{ width: `${progressPercent}%` }} />
                        </div>
                        <span className="sw-progress-label">{progressPercent}% done</span>
                    </div>

                    <div className="sw-summary-rows">
                        <div className="sw-summary-row">
                            <span>Completed</span>
                            <span>{completedExercises.length} of {exercises.length}</span>
                        </div>
                        <div className="sw-summary-row">
                            <span>Remaining</span>
                            <span>{exercises.length - completedExercises.length}</span>
                        </div>
                        <div className="sw-summary-row">
                            <span>Time</span>
                            <span>{formatTime(seconds)}</span>
                        </div>
                    </div>

                    <div className="sw-ctrl-buttons">
                        {!isRunning && (
                            <button className="sw-btn-primary full" onClick={handleStart}>
                                ▶ Start Workout
                            </button>
                        )}
                        {isRunning && !isPaused && (
                            <button className="sw-btn-ghost full" onClick={handlePause}>
                                ⏸ Pause
                            </button>
                        )}
                        {isRunning && isPaused && (
                            <button className="sw-btn-primary full" onClick={handleResume}>
                                ▶ Resume
                            </button>
                        )}
                        {isRunning && (
                            <button
                                className={`sw-btn-done full ${completedExercises.length === 0 ? "disabled" : ""}`}
                                onClick={handleDone}
                                disabled={completedExercises.length === 0}
                                title={completedExercises.length === 0 ? "Complete at least one exercise first" : ""}
                            >
                                ✓ Finish Workout
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default StartingWorkout;
