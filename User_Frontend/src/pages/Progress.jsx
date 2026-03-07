import React, { useState, useEffect } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "../assets/Progress.css";

import { Bar } from "react-chartjs-2";
import { PolarArea } from "react-chartjs-2";

import {
  Chart as ChartJS,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Progress() {

  const [period, setPeriod] = useState("week");

  const [level, setLevel] = useState();
  const [exp, setExp] = useState();
  const [currentStreak, setCurrentStreak] = useState();
  const [highestStreak, setHighestStreak] = useState();
  const [recentAchievements, setRecentAchievements] = useState([]);

  const [workoutCounts, setWorkoutCounts] = useState([]);
  const [hourCounts, setHourCounts] = useState([]);
  const [workoutDistribution, setWorkoutDistribution] = useState([]);

  const [routineHistory, setRoutineHistory] = useState([]);

  const [heatmapData, setHeatmapData] = useState([]);

  const [maxBarValue, setMaxBarValue] = useState(10);

  useEffect(() => {
    loadProgress();
  }, [period]);

  const formatHours = (minutes) => {
    if (!minutes || minutes === 0) return "0 hrs";
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hrs} hr${hrs !== 1 ? "s" : ""} ${mins > 0 ? `${mins} min` : ""}`.trim();
    };

  const loadProgress = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3500/users/progress/${period}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();

      if (res.ok) {

        setLevel(data.level);
        setExp(data.exp);
        setCurrentStreak(data.currentStreak);
        setRecentAchievements(data.recentAchievements);

        setWorkoutCounts(data.workoutCounts);

        let displayHours = 
        setHourCounts(data.hourCounts);
        setWorkoutDistribution(data.workoutDistribution);

        setRoutineHistory(data.routineHistory);

        setMaxBarValue(Math.max(...data.workoutCounts, ...data.hourCounts) + 1);

        const heatmap = data.routineHistory.map(r => ({
          date: r.dateCompleted,
          count: r.exercises.length
        }));

        setHeatmapData(heatmap);

      }

    } catch (err) {
      console.error("Error loading progress:", err);
    }

  };

  const totalWorkouts = workoutCounts.reduce((a, b) => a + b, 0);

  const highestWorkout = Math.max(...workoutCounts, 0);

  const totalHours = hourCounts.reduce((a, b) => a + b, 0);

  const avgWorkout =
    workoutCounts.length > 0 ? (totalWorkouts / workoutCounts.length).toFixed(1) : 0;

  const avgTime =
    hourCounts.length > 0 ? (totalHours / hourCounts.length).toFixed(1) : 0;



  const labels =
    period === "week"
      ? ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
      : period === "month"
      ? Array.from({ length: 31 }, (_, i) => i + 1)
      : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div className="page">

      <h1>My Progress</h1>
      <div className="progress-first-container">

        <div className="progress-game-summary">

          <div className="progress-game-box">
            <h3>Your Level</h3>
            <p>{level}</p>
          </div>

          <div className="progress-game-box">
            <h3>Total Exp Earned</h3>
            <p>{exp} XP</p>
          </div>

          <div className="progress-game-box">
            <h3>Current Streak</h3>
            <p>{currentStreak} Days</p>
          </div>

          <div className="progress-game-box">
            <h3>Highest Streak</h3>
            <p>{highestStreak || currentStreak}</p>
          </div>

          <div className="progress-game-box">

            <h3>Recent Achievements</h3>

            <ul>
              {recentAchievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>

          </div>

        </div>

      </div>

      <div className="progress-upper-container">

        <div className="progress-calendar">

          <h2>Your Activity</h2>

          <CalendarHeatmap
            startDate={new Date("2026-01-01")}
            endDate={new Date("2026-12-31")}
            values={heatmapData}
            showWeekdayLabels
            classForValue={(value) => {
              if (!value || value.count === 0) return "color-empty";
              return `color-scale-${Math.min(value.count, 4)}`;
            }}
          />

        </div>

      </div>

      <div className="progress-third-container">

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>

        <div className="progress-charts-holder">

          <div className="progress-bar-holder">

            <h2>Your Progress</h2>

            <div className="progress-bar-item">

              <Bar
                data={{
                  labels: labels,
                  datasets: [
                    {
                      label: "No. of Workouts",
                      data: workoutCounts,
                      backgroundColor: "#4d4dff",
                      borderRadius: 5
                    },
                    {
                      label: "Time Spent (Hours)",
                      data: hourCounts,
                      backgroundColor: "#ff534d",
                      borderRadius: 5
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: maxBarValue
                    }
                  }
                }}
              />

            </div>

          </div>

          <div className="progress-doughnut-holder">

            <h2>Your Workout Distribution</h2>

            <div className="progress-pie-item">

              <PolarArea
                data={{
                  labels: ["Chest","Back","Shoulders","Arms","Core/Abs","Legs"],
                  datasets: [{
                    data: workoutDistribution,
                    backgroundColor: [
                      "rgba(255,99,132,0.6)",
                      "rgba(54,162,235,0.6)",
                      "rgba(75,192,192,0.6)",
                      "rgba(255,159,64,0.6)",
                      "rgba(153,102,255,0.6)",
                      "rgba(0,255,255,0.6)"
                    ]
                  }]
                }}
              />

            </div>

          </div>

        </div>

        <div className="progress-stats-holder">

          <div className="progress-game-summary">

            <div className="progress-game-box">
              <h3>Total Workouts</h3>
              <p>{totalWorkouts}</p>
            </div>

            <div className="progress-game-box">
              <h3>Average Workout</h3>
              <p>{avgWorkout}</p>
            </div>

            <div className="progress-game-box">
              <h3>Highest Workout</h3>
              <p>{highestWorkout}</p>
            </div>

            <div className="progress-game-box">
                <h3>Total Time Spent</h3>
                <p>{formatHours(totalHours * 60)}</p>
            </div>

            <div className="progress-game-box">
                <h3>Average Time</h3>
                <p>{formatHours(avgTime * 60)}</p>
            </div>
          </div>

        </div>

      </div>

      <div className="progress-routine-history-container">

        <h2>Recent Routines History</h2>

        <table>

          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Duration</th>
              <th>Focus</th>
              <th>No. of Workouts</th>
              <th>Exp Gained</th>
            </tr>
          </thead>

          <tbody>

            {routineHistory.map((r, i) => {

              const focus = [...new Set(r.exercises.map(e => e.category))];

              return (
                <tr key={i}>

                  <td>{r.routineName}</td>

                  <td>{new Date(r.dateCompleted).toLocaleDateString()}</td>

                  <td>{(r.duration / 60).toFixed(2)} hrs</td>

                  <td>{focus.join(", ")}</td>

                  <td>{r.exercises.length}</td>

                  <td>{r.expGained}</td>

                </tr>
              );

            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Progress;