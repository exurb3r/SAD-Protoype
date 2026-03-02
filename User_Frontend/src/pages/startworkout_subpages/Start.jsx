import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../../assets/Add.css";

function StartingWorkout() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [routineName, setRoutineName] = useState("");
  const [exercises, setExercises] = useState([]);

  const [completedExercises, setCompletedExercises] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused]);

  function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }


  function handleStart() {
    setSeconds(0);
    setCompletedExercises([]); 
    setIsRunning(true);
    setIsPaused(false);
  }

  function handlePause() {
    setIsPaused(true);
  }

  function handleResume() {
    setIsPaused(false);
  }

  async function handleDone() {
    if (!isRunning) return;
    if (completedExercises.length === 0) {
      alert("You must complete at least one exercise.");
      return;
    }

    const submitProgress = confirm("Are you done with your workout? ");
    if(submitProgress){
    try {
      setIsRunning(false);
      setIsPaused(false);

      const response = await fetch(
        "http://localhost:3500/users/startworkout/finishworkout",
        {
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
            workoutList: exercises,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to record workout.");
        return;
      }


      let message = `
        Workout Complete!

        EXP Gained: ${data.expGained}
        Completion: ${data.completionRate}%
        Multiplier: x${data.multiplier}
        Current Level: ${data.newLevel}
      `;

      if (data.leveledUp) {
        message += "\n LEVEL UP! ";
      }

      alert(message);

      navigate("/startworkout");

    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  }
}

  function toggleExercise(index) {
    if (!isRunning || isPaused) return;

    setCompletedExercises(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  }

  function returnToPreviousStage(){
    const confirmation = confirm(" Go back to previous page ?");
    if (confirmation){
      navigate('/startworkout');
    }
  }

  const progressPercent =
    exercises.length === 0
      ? 0
      : Math.round((completedExercises.length / exercises.length) * 100);

  async function fetchRoutine() {
    try {
      const res = await fetch(
        `http://localhost:3500/users/startworkout/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      if (data.routine) {
        setRoutineName(data.routine.routineName);
        setExercises(data.routine.exercises || []);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchRoutine();
  }, [id]);


  return (
    <div className="add-routine-page">
      <div className="add-routine-baryeah">
        <button className="add-routine-back-btn" onClick={() => returnToPreviousStage()}>🔙</button>
        <h1 className="add-routine-title">
          {routineName || "Starting Workout"}
        </h1>
      </div>

      <div className="add-routine-container">
        <div className="add-routine-left-box">
          <h2>Your List</h2>
          <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
              
          </div>
          <p>{progressPercent}% Completed</p>
          <div className="add-routine-exercise-preview">
            <ul className="add-routine-exercise-list">
              {exercises.map((ex, index) => (
                <li key={index} className="add-routine-exercise-item">
                  <input
                    type="checkbox"
                    disabled={!isRunning || isPaused}
                    checked={completedExercises.includes(index)}
                    onChange={() => toggleExercise(index)}
                  />

                  <label className="exercise-description">
                    <p>{ex.nameOfexercise}</p>
                    <p>{ex.category}</p>
                    <p>{ex.reps} reps</p>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="add-routine-right-box">
          <h2 className="add-routine-overview-title">
            Workout Overview
          </h2>

          <div className="progress-wrapper">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p>{progressPercent}% Completed</p>
          </div>

          <div className="workout-controls">
            <h2>{formatTime(seconds)}</h2>

            {!isRunning && (
              <button onClick={handleStart}>Start</button>
            )}

            {isRunning && !isPaused && (
              <button onClick={handlePause}>Pause</button>
            )}

            {isRunning && isPaused && (
              <button onClick={handleResume}>Continue</button>
            )}

            {isRunning && (
              <button onClick={handleDone}>Done / Exit</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartingWorkout;