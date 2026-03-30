import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/Dashboard.css';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ArcElement } from "chart.js";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
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

function StatCard({ label, value, sub }) {
    return (
        <div className="stat-card">
            <span className="stat-label">{label}</span>
            <span className="stat-value">{value}</span>
            {sub && <span className="stat-sub">{sub}</span>}
        </div>
    );
}

function SectionTitle({ children }) {
    return <h2 className="section-title">{children}</h2>;
}

function Dashboard() {
    const [username, setUsername] = useState('');
    const [membership, setMembership] = useState('');
    const [currentStreak, setCurrentStreak] = useState(0);
    const [membershipDuration, setMembershipDuration] = useState(0);
    const [recentAchievements, setRecentAchievements] = useState([]);
    const [exp, setExp] = useState(0);
    const [level, setLevel] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [barData, setBarData] = useState([]);
    const [barData2, setBarData2] = useState([]);
    const [doughnutData, setDoughnutData] = useState([]);
    const [maxBarValue, setMaxBarValue] = useState(10);
    const [numberOfWorkouts, setNumberOfWorkouts] = useState(0);
    const [duration, setDuration] = useState(0);
    const [focus, setFocus] = useState([]);
    const [expGained, setExpGained] = useState(0);

    useEffect(() => { loadUserData(); }, []);

    const loadUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch('http://localhost:3500/users/dashboard', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) {
                setUsername(data.username);
                setMembership(data.membership);
                setCurrentStreak(data.currentStreak);
                setMembershipDuration(data.membershipDuration);
                setRecentAchievements(data.recentAchievements);
                setExp(data.exp);
                setLevel(data.level);
                setNotifications(data.notifications);
                setBarData(data.weeklyWorkouts);
                setBarData2(data.weeklyHours);
                setDoughnutData(data.workoutDistribution);
                setMaxBarValue(Math.max(...data.weeklyWorkouts, ...data.weeklyHours) + 1);
                setNumberOfWorkouts(data.numberOfWorkouts);
                setDuration(Math.ceil((data.duration / 60) * 100) / 100);
                setFocus(data.focus);
                setExpGained(data.expGained);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const expPercent = 70;

    return (
        <div className="dashboard-page">

            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-greeting">Welcome back, <span>{username}</span></p>
                </div>
                <Link to="/startworkout">
                    <button className="start-btn">+ Start Workout</button>
                </Link>
            </div>

            {/* Top row */}
            <div className="top-row">

                {/* Level card */}
                <div className="card level-card">
                    <div className="level-ring">
                        <CircularProgressbar
                            value={expPercent}
                            text={`Lvl ${level}`}
                            styles={buildStyles({
                                textColor: '#fff',
                                textSize: '18px',
                                pathColor: '#dc2626',
                                trailColor: 'rgba(255,255,255,0.07)',
                                strokeLinecap: 'round',
                            })}
                        />
                    </div>
                    <div className="level-info">
                        <p className="level-exp-label">Total EXP</p>
                        <p className="level-exp-value">{exp?.toLocaleString()}</p>
                        <div className="exp-bar-bg">
                            <div className="exp-bar-fill" style={{ width: `${expPercent}%` }} />
                        </div>
                        <p className="exp-bar-caption">{expPercent}% to next level</p>
                    </div>
                </div>

                {/* Stats row */}
                <div className="card stats-card">
                    <div className="stats-top-row">
                        <StatCard label="Current Streak" value={`${currentStreak}`} sub="days" />
                        <StatCard label="Membership" value={membership} sub={`${membershipDuration} days`} />
                    </div>
                    <div className="achievements-box">
                        <p className="achievements-label">Recent Achievements</p>
                        <div className="achievements-list">
                            {recentAchievements.length > 0
                                ? recentAchievements.map((a, i) => (
                                    <span key={i} className="achievement-badge">{a}</span>
                                ))
                                : <span className="no-data">No achievements yet</span>
                            }
                        </div>
                    </div>
                </div>

                {/* Last workout */}
                <div className="card last-workout-card">
                    <p className="card-label">Last Workout</p>
                    <div className="last-workout-grid">
                        <div className="lw-item">
                            <span className="lw-num">{numberOfWorkouts}</span>
                            <span className="lw-sub">Exercises</span>
                        </div>
                        <div className="lw-item">
                            <span className="lw-num">{duration}h</span>
                            <span className="lw-sub">Duration</span>
                        </div>
                        <div className="lw-item">
                            <span className="lw-num">+{expGained}</span>
                            <span className="lw-sub">EXP</span>
                        </div>
                    </div>
                    {focus.length > 0 && (
                        <div className="focus-tags">
                            {focus.map((f, i) => (
                                <span key={i} className="focus-tag">{f}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Charts */}
            <div className="charts-row">
                <div className="card chart-card chart-bar">
                    <SectionTitle>Your Week</SectionTitle>
                    <div className="chart-wrap">
                        <Bar
                            data={{
                                labels: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
                                datasets: [
                                    {
                                        label: "Workouts",
                                        data: barData,
                                        backgroundColor: "#dc2626",
                                        borderRadius: 6,
                                        borderWidth: 0,
                                    },
                                    {
                                        label: "Hours",
                                        data: barData2,
                                        backgroundColor: "rgba(255,255,255,0.12)",
                                        borderRadius: 6,
                                        borderWidth: 0,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        labels: { color: '#888', font: { size: 11 } }
                                    },
                                },
                                scales: {
                                    x: { ticks: { color: '#555' }, grid: { color: 'rgba(255,255,255,0.04)' } },
                                    y: { beginAtZero: true, max: maxBarValue, ticks: { color: '#555' }, grid: { color: 'rgba(255,255,255,0.04)' } },
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="card chart-card chart-doughnut">
                    <SectionTitle>Workout Split</SectionTitle>
                    <div className="chart-wrap">
                        <Doughnut
                            data={{
                                labels: ["Chest","Back","Shoulders","Arms","Core","Legs"],
                                datasets: [{
                                    data: doughnutData,
                                    backgroundColor: ["#dc2626","#f87171","#fff","#9ca3af","#4b4b4b","#1f1f1f"],
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
                                        labels: { color: '#888', font: { size: 11 }, padding: 12, boxWidth: 10 }
                                    },
                                },
                                cutout: '68%',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="notif-section">
                <SectionTitle>Notifications</SectionTitle>
                <div className="notif-list">
                    {notifications.length > 0
                        ? notifications.map((n) => (
                            <div key={n.id} className="notif-item">
                                <span className="notif-dot" />
                                <p>{n.message}</p>
                            </div>
                        ))
                        : <p className="no-data">No new notifications</p>
                    }
                </div>
            </div>

        </div>
    );
}

export default Dashboard;
