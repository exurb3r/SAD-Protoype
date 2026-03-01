import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import "../../assets/Add.css";

function EditWorkout() {
    const navigate = useNavigate();

    const { id } = useParams();
    const [routineName, setRoutineName] = useState("");

    const [exerciseName, setExerciseName] = useState("");
    const [category, setCategory] = useState("");
    const [reps, setReps] = useState("");

    const [exercises, setExercises] = useState([]);

    const [editingIndex, setEditingIndex] = useState(null);
    const [editName, setEditName] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editReps, setEditReps] = useState("");
    const [dayAssigned, setDayAssigned] = useState("");
    const [timeAssigned, setTimeAssigned] = useState("");

    function handleAddExercise(e) {
        e.preventDefault();
        if (!exerciseName || !reps) return;

        const newExercise = {
        nameOfexercise: exerciseName,
        category,
        reps: Number(reps)
        };
        setExercises([...exercises, newExercise]);
        setExerciseName("");
        setReps("");
    }

    function handleDelete(index) {
        const updated = exercises.filter((_, i) => i !== index);
        setExercises(updated);
    }

    function handleCopy(index) {
        const copiedExercise = { ...exercises[index] };
        setExercises([...exercises, copiedExercise]);
    }

    function handleUpdate(index) {
        const updated = [...exercises];
        updated[index] = {
        ...updated[index],
        nameOfexercise: editName,
        category: editCategory,
        reps: Number(editReps)
        };

        setExercises(updated);
        setEditingIndex(null);
    }



    async function updateRoutine() {
        if (!routineName || exercises.length === 0) {
            alert("Please add a routine name and at least one exercise.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3500/users/startworkout/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                routineName,
                exercises,
                dayAssigned,
                timeAssigned
            })
            });

            const data = await response.json();
            console.log(data);
            alert("Routine updated!");
            navigate("/startworkout");
        } catch (err) {
            console.error(err);
        }
    }
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
            }
    }


    useEffect(() => {
        
        fetchRoutine();
    }, [id]);
  return (
    <div className="add-routine-page">
        <div className="add-routine-baryeah">
            <Link to={"/startworkout"}><button className="add-routine-back-btn">🔙</button></Link>
            <h1 className="add-routine-title">Edit Workout</h1>
        </div>

      <div className="add-routine-container">

        <div className="add-routine-left-box">
            <h2>Exercise Details </h2>
            <div className="add-routine-baryeah">
                <label className="add-routine-category-label">Assign a day (optional):</label>
                <select
                    className="add-routine-category-select"
                    value={dayAssigned}
                    onChange={(e) => setDayAssigned(e.target.value)}
                >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                </select>
                <label className="add-routine-time-label">Select a time:</label>
                <input type="time" value={timeAssigned} onChange={(e) => setTimeAssigned(e.target.value)}></input>
            </div>  
          <form onSubmit={handleAddExercise} className="add-routine-form">
            <input
              className="add-routine-title-input"
              type="text"
              placeholder="Title of Routine"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
            />

            <div className="add-routine-exercise-inputs">
              <input
                className="add-routine-exercise-name"
                type="text"
                placeholder="Exercise Name"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
              />

              <select
                className="add-routine-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Chest">Chest</option>
                <option value="Back">Back</option>
                <option value="Shoulders">Shoulders</option>
                <option value="Arms">Arms</option>
                <option value="Core/Abs">Core/Abs</option>
                <option value="Legs">Legs</option>
              </select>

              <input
                className="add-routine-reps-input"
                type="number"
                placeholder="Number of Sets/Reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                min="0"
              />
                <button
                type="submit"
                className="add-routine-add-btn"
                >
                Add Exercise
            </button>
            </div>
          </form>

          <div className="add-routine-exercise-preview">
            <ul className="add-routine-exercise-list">
              {exercises.map((ex, index) => (
                <li key={index} className="add-routine-exercise-item">

                  {editingIndex === index ? (
                    <>
                      <input
                        className="add-routine-edit-name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />

                      <select
                        className="add-routine-edit-category"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                      >
                        <option value="Chest">Chest</option>
                        <option value="Back">Back</option>
                        <option value="Shoulders">Shoulders</option>
                        <option value="Arms">Arms</option>
                        <option value="Core/Abs">Core/Abs</option>
                        <option value="Legs">Legs</option>
                      </select>

                      <input
                        className="add-routine-edit-reps"
                        type="number"
                        value={editReps}
                        onChange={(e) => setEditReps(e.target.value)}
                        min="0"
                      />

                      <button
                        className="add-routine-btn-outline"
                        onClick={() => setEditingIndex(null)}
                      >
                        Cancel
                      </button>

                      <button
                        className="add-routine-btn-outline"
                        onClick={() => handleUpdate(index)}
                      >
                        Confirm
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="add-routine-ex-name">{ex.nameOfexercise}</span>
                      <span className="add-routine-ex-category">{ex.category}</span>
                      <span className="add-routine-ex-reps">{ex.reps} reps</span>

                      <button
                        className="add-routine-btn-outline"
                        onClick={() => {
                          setEditingIndex(index);
                          setEditName(ex.nameOfexercise);
                          setEditCategory(ex.category);
                          setEditReps(ex.reps);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="add-routine-btn-outline"
                        onClick={() => handleCopy(index)}
                      >
                        Copy
                      </button>

                      <button
                        className="add-routine-btn-outline"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="add-routine-right-box">
          <h2 className="add-routine-overview-title">Workout Overview</h2>

          <div className="add-routine-chart-container">
            <Doughnut
              data={{
                labels: ["Chest", "Back", "Shoulders", "Arms", "Core/Abs", "Legs"],
                datasets: [{
                  data: [
                    exercises.filter(e => e.category === "Chest").length,
                    exercises.filter(e => e.category === "Back").length,
                    exercises.filter(e => e.category === "Shoulders").length,
                    exercises.filter(e => e.category === "Arms").length,
                    exercises.filter(e => e.category === "Core/Abs").length,
                    exercises.filter(e => e.category === "Legs").length,
                  ],
                  backgroundColor: ["blue", "red", "yellow", "green", "violet", "orange"],
                  borderWidth: 0,
                }],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>

          <div className="add-routine-summary">
            <p><strong>{routineName || "No Title Yet"}</strong></p>
            <p>Total Exercises: {exercises.length}</p>
            <p>
              Focus:{" "}
              {exercises
                .map(e => e.category)
                .filter((v, i, a) => a.indexOf(v) === i)
                .join(", ")}
            </p>
            <button className="add-routine-save-btn" onClick={updateRoutine}>Update Routine</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default EditWorkout;