import React, { useState, useEffect } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "../assets/Progress.css";
import { Bar, PolarArea } from "react-chartjs-2";
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

ChartJS.register(RadialLinearScale, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  useEffect(() => { loadProgress(); }, [period]);

  const formatHours = (minutes) => {
    if (!minutes || minutes === 0) return "0 hrs";
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hrs}h${mins > 0 ? ` ${mins}m` : ""}`;
  };

  const loadProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3500/users/progress/${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setLevel(data.level);
        setExp(data.exp);
        setCurrentStreak(data.currentStreak);
        setHighestStreak(data.highestStreak);
        setRecentAchievements(data.recentAchievements);
        setWorkoutCounts(data.workoutCounts);
        setHourCounts(data.hourCounts);
        setWorkoutDistribution(data.workoutDistribution);
        setRoutineHistory(data.routineHistory);
        setMaxBarValue(Math.max(...data.workoutCounts, ...data.hourCounts) + 1);
        setHeatmapData(data.routineHistory.map(r => ({
          date: r.dateCompleted,
          count: r.exercises.length
        })));
      }
    } catch (err) {
      console.error("Error loading progress:", err);
    }
  };

  const totalWorkouts = workoutCounts.reduce((a, b) => a + b, 0);
  const highestWorkout = Math.max(...workoutCounts, 0);
  const totalHours = hourCounts.reduce((a, b) => a + b, 0);
  const avgWorkout = workoutCounts.length > 0 ? (totalWorkouts / workoutCounts.length).toFixed(1) : 0;
  const avgTime = hourCounts.length > 0 ? (totalHours / hourCounts.length).toFixed(1) : 0;

  const labels =
    period === "week"
      ? ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
      : period === "month"
      ? Array.from({ length: 31 }, (_, i) => i + 1)
      : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div className="pg-page">

      <div className="pg-header">
        <h1 className="pg-title">My Progress</h1>
        <p className="pg-sub">Track your fitness journey over time</p>
      </div>

      {/* Player stats */}
      <div className="pg-section">
        <div className="pg-game-summary">
          <div className="pg-game-box"><h3>Level</h3><p>{level}</p></div>
          <div className="pg-game-box"><h3>Total XP</h3><p>{exp?.toLocaleString()} xp</p></div>
          <div className="pg-game-box"><h3>Current Streak</h3><p>{currentStreak} Days</p></div>
          <div className="pg-game-box"><h3>Best Streak</h3><p>{highestStreak || currentStreak} Days</p></div>
          <div className="pg-game-box pg-achievements-box">
            <h3>Recent Achievements</h3>
            <div className="pg-achieve-list">
              {recentAchievements.map((a, i) => (
                <span key={i} className="pg-achieve-badge">{a}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="pg-section pg-card">
        <p className="pg-card-label">Activity — 2026</p>
        <div className="pg-heatmap-wrap">
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

      {/* Charts */}
      <div className="pg-section pg-card">
        <div className="pg-charts-head">
          <p className="pg-card-label">Workout Stats</p>
          <select className="pg-period-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="week">Weekly</option>
            <option value="month">Daily</option>
            <option value="year">Monthly</option>
          </select>
        </div>

        <div className="pg-charts-holder">
          <div className="pg-bar-holder">
            <p className="pg-chart-title">Workouts & Hours</p>
            <div className="pg-bar-item">
              <Bar
                data={{
                  labels,
                  datasets: [
                    { label: "No. of Workouts", data: workoutCounts, backgroundColor: "#dc2626", borderRadius: 5, borderWidth: 0 },
                    { label: "Time Spent (hrs)", data: hourCounts, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 5, borderWidth: 0 }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#888', font: { size: 11 } } } },
                  scales: {
                    x: { ticks: { color: '#555' }, grid: { color: 'rgba(255,255,255,0.04)' } },
                    y: { beginAtZero: true, max: maxBarValue, ticks: { color: '#555' }, grid: { color: 'rgba(255,255,255,0.04)' } }
                  }
                }}
              />
            </div>
          </div>

          <div className="pg-polar-holder">
            <p className="pg-chart-title">Muscle Split</p>
            <div className="pg-pie-item">
              <PolarArea
                data={{
                  labels: ["Chest","Back","Shoulders","Arms","Core/Abs","Legs"],
                  datasets: [{
                    data: workoutDistribution,
                    backgroundColor: ["#dc2626","#f87171","rgba(255,255,255,0.8)","#9ca3af","#4b4b4b","#1f1f1f"],
                    borderWidth: 0
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#888', font: { size: 11 }, padding: 10, boxWidth: 10 } } },
                  scales: { r: { ticks: { display: false }, grid: { color: 'rgba(255,255,255,0.06)' } } }
                }}
              />
            </div>
          </div>
        </div>

        {/* Period stat boxes */}
        <div className="pg-game-summary pg-stats-row">
          <div className="pg-game-box"><h3>Total Workouts</h3><p>{totalWorkouts}</p></div>
          <div className="pg-game-box"><h3>Avg / Day</h3><p>{avgWorkout}</p></div>
          <div className="pg-game-box"><h3>Best Day</h3><p>{highestWorkout}</p></div>
          <div className="pg-game-box"><h3>Total Time</h3><p>{formatHours(totalHours * 60)}</p></div>
          <div className="pg-game-box"><h3>Avg Time</h3><p>{formatHours(avgTime * 60)}</p></div>
        </div>
      </div>

      {/* History table */}
      <div className="pg-section pg-card">
        <p className="pg-card-label">Routine History</p>
        <div className="pg-table-wrap">
          <table className="pg-table">
            <thead>
              <tr>
                <th>Routine</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Focus</th>
                <th>Exercises</th>
                <th>XP</th>
              </tr>
            </thead>
            <tbody>
              {routineHistory.map((r, i) => {
                const focus = [...new Set(r.exercises.map(e => e.category))];
                return (
                  <tr key={i}>
                    <td className="pg-td-name">{r.routineName}</td>
                    <td>{new Date(r.dateCompleted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>{(r.duration / 60).toFixed(2)} hrs</td>
                    <td>
                      <div className="pg-focus-tags">
                        {focus.map((f, fi) => <span key={fi} className="pg-focus-tag">{f}</span>)}
                      </div>
                    </td>
                    <td>{r.exercises.length}</td>
                    <td className="pg-td-xp">+{r.expGained}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Progress;
