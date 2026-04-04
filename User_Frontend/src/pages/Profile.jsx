import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Profile.css';
import { Bar, Doughnut } from 'react-chartjs-2';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const TABS = ["overview", "stats", "friends", "achievements", "routine"];
const TAB_LABELS = { overview: "Overview", stats: "Stats", friends: "Friends", achievements: "Achievements", routine: "Shared Routines" };

function Profile() {
    const navigate = useNavigate();
    const [tab, setTab] = useState("overview");
    const [showEdit, setShowEdit] = useState(false);
    const [showInvite, setShowInvite] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const token = localStorage.getItem("token");

    const [profile, setProfile] = useState({ username: "", level: 1, exp: 0, expNext: 100, motto: "", joined: "", streak: 0 });
    const [friends, setFriends] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [sharedRoutines, setSharedRoutines] = useState([]);
    const [workoutsPerWeek, setWorkoutsPerWeek] = useState([0,0,0,0,0,0,0]);
    const [workoutDistribution, setWorkoutDistribution] = useState([0,0,0,0,0,0]);

    const [editData, setEditData] = useState({ username: "", email: "", password: "", motto: "" });
    const [inviteData, setInviteData] = useState({ date: "", time: "", message: "" });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("http://localhost:3500/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setProfile({
                    username: data.username,
                    level: data.level,
                    exp: data.exp,
                    expNext: data.expNext,
                    motto: data.motto,
                    joined: new Date(data.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    streak: data.streak
                });
                setFriends(data.friends || []);
                setAchievements(data.achievements || []);
                setSharedRoutines(data.sharedRoutines || []);
                setWorkoutsPerWeek(data.weeklyWorkouts || [0,0,0,0,0,0,0]);
                setWorkoutDistribution(data.workoutDistribution || [0,0,0,0,0,0]);
            } catch (err) { console.log(err); }
        };
        fetchProfile();
    }, [token]);

    const expPercent = profile.expNext ? Math.round((profile.exp / profile.expNext) * 100) : 0;

    const handleEditChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

    const saveProfile = async () => {
        try {
            await fetch("http://localhost:3500/users/profile/edit", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(editData)
            });
            setProfile(prev => ({
                ...prev,
                username: editData.username || prev.username,
                motto: editData.motto || prev.motto
            }));
            setShowEdit(false);
        } catch (err) { console.log(err); }
    };

    const openInvite = (friend) => {
        setSelectedFriend(friend);
        setInviteData({ date: "", time: "", message: "" });
        setShowInvite(true);
    };

    const unfriend = async (friendId) => {
        try {
            await fetch(`http://localhost:3500/users/profile/unfriend/${friendId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriends(prev => prev.filter(f => f.userId !== friendId));
        } catch (err) { console.log(err); }
    };

    const sendInvite = async () => {
        try {
            await fetch("http://localhost:3500/users/profile/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ friendId: selectedFriend.userId, ...inviteData })
            });
            setShowInvite(false);
        } catch (err) { console.log(err); }
    };

    const chartAxisStyle = { ticks: { color: '#555' }, grid: { color: 'rgba(255,255,255,0.04)' } };

    const barData = {
        labels: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
        datasets: [{
            label: "Workouts",
            data: workoutsPerWeek,
            backgroundColor: "#dc2626",
            borderRadius: 6,
            borderWidth: 0
        }]
    };

    const doughnutData = {
        labels: ["Chest","Back","Shoulders","Arms","Abs","Legs"],
        datasets: [{
            data: workoutDistribution,
            backgroundColor: ["#dc2626","#f87171","#ffffff","#9ca3af","#4b4b4b","#1f1f1f"],
            borderWidth: 0,
            borderRadius: 4
        }]
    };

    return (
        <div className="pf-page">

            {/* Profile card */}
            <div className="pf-card pf-identity-card">
                <div className="pf-identity-upper">
                    <div className="pf-avatar">
                        <span>{profile.username?.[0]?.toUpperCase() || "?"}</span>
                    </div>
                    <div className="pf-identity-info">
                        <div className="pf-identity-row">
                            <span className="pf-username">{profile.username}</span>
                            <span className="pf-level-badge">Lvl {profile.level}</span>
                            <span className="pf-xp-badge">{profile.exp?.toLocaleString()} xp</span>
                            <button className="pf-btn-edit" onClick={() => setShowEdit(true)}>Edit Profile</button>
                        </div>
                        <p className="pf-motto">{profile.motto || "No motto set yet"}</p>
                        <div className="pf-meta-row">
                            <span>Joined {profile.joined}</span>
                            <span>·</span>
                            <span>{friends.length} friends</span>
                            <span>·</span>
                            <span>{profile.streak} day streak</span>
                        </div>
                    </div>
                </div>

                <div className="pf-tabs">
                    {TABS.map(t => (
                        <button key={t} className={`pf-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                            {TAB_LABELS[t]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content */}
            <div className="pf-card pf-content-card">

                {tab === "overview" && (
                    <div className="pf-overview">
                        <p className="pf-card-label">Gamification Overview</p>
                        <div className="pf-overview-hero">
                            <div className="pf-ring">
                                <CircularProgressbar
                                    value={expPercent}
                                    text={`${expPercent}%`}
                                    styles={buildStyles({
                                        textColor: '#fff',
                                        textSize: '18px',
                                        pathColor: '#dc2626',
                                        trailColor: 'rgba(255,255,255,0.07)',
                                        strokeLinecap: 'round',
                                    })}
                                />
                            </div>
                            <div className="pf-overview-meta">
                                <p className="pf-overview-exp">{profile.exp} <span>/ {profile.expNext} XP</span></p>
                                <div className="pf-exp-bar-bg">
                                    <div className="pf-exp-bar-fill" style={{ width: `${expPercent}%` }} />
                                </div>
                                <p className="pf-exp-caption">{expPercent}% to next level</p>
                            </div>
                        </div>
                        <div className="pf-stat-grid">
                            <div className="pf-stat-box"><span className="pf-stat-label">Streak</span><span className="pf-stat-value">{profile.streak} days</span></div>
                            <div className="pf-stat-box"><span className="pf-stat-label">Total XP</span><span className="pf-stat-value">{profile.exp?.toLocaleString()}</span></div>
                            <div className="pf-stat-box"><span className="pf-stat-label">Friends</span><span className="pf-stat-value">{friends.length}</span></div>
                            <div className="pf-stat-box"><span className="pf-stat-label">Achievements</span><span className="pf-stat-value">{achievements.length}</span></div>
                        </div>
                    </div>
                )}

                {tab === "stats" && (
                    <div className="pf-stats">
                        <p className="pf-card-label">Workout Stats</p>
                        <div className="pf-charts-grid">
                            <div className="pf-chart-wrap">
                                <p className="pf-chart-title">Weekly Workouts</p>
                                <div className="pf-chart-inner">
                                    <Bar data={barData} options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { labels: { color: '#888', font: { size: 11 } } } },
                                        scales: { x: chartAxisStyle, y: { ...chartAxisStyle, beginAtZero: true } }
                                    }} />
                                </div>
                            </div>
                            <div className="pf-chart-wrap">
                                <p className="pf-chart-title">Muscle Split</p>
                                <div className="pf-chart-inner">
                                    <Doughnut data={doughnutData} options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: 'bottom', labels: { color: '#888', font: { size: 11 }, padding: 10, boxWidth: 10 } } },
                                        cutout: '65%'
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {tab === "friends" && (
                    <div className="pf-friends">
                        <p className="pf-card-label">Your Friends ({friends.length})</p>
                        {friends.length === 0 && <p className="pf-empty">No friends yet.</p>}
                        {friends.map(friend => (
                            <div key={friend.userId} className="pf-friend-row">
                                {/* Clickable avatar + name area */}
                                <div
                                    className="pf-friend-clickable"
                                    onClick={() => navigate(`/friend/${friend.userId}`)}
                                >
                                    <div className="pf-friend-avatar">
                                        {friend.username?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="pf-friend-name">{friend.username}</span>
                                </div>
                                {/* Actions stay separate so they don't trigger navigation */}
                                <div className="pf-friend-actions">
                                    <button
                                        className="pf-btn-ghost"
                                        onClick={(e) => { e.stopPropagation(); openInvite(friend); }}
                                    >
                                        Invite
                                    </button>
                                    <button
                                        className="pf-btn-ghost danger"
                                        onClick={(e) => { e.stopPropagation(); unfriend(friend.userId); }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tab === "achievements" && (
                    <div className="pf-achievements">
                        <p className="pf-card-label">Achievements ({achievements.length})</p>
                        {achievements.length === 0 && <p className="pf-empty">No achievements yet.</p>}
                        <div className="pf-stat-grid">
                            {achievements.map((a, i) => (
                                <div key={a._id || i} className="pf-achieve-card">
                                    <p className="pf-achieve-title">{a.title}</p>
                                    <p className="pf-achieve-desc">{a.description}</p>
                                    <span className="pf-achieve-xp">+{a.exp_gained} XP</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === "routine" && (
                    <div className="pf-routines">
                        <p className="pf-card-label">Shared Routines ({sharedRoutines.length})</p>
                        {sharedRoutines.length === 0 && <p className="pf-empty">No shared routines yet.</p>}
                        {sharedRoutines.map((r, i) => (
                            <div key={i} className="pf-routine-row">
                                <span>{r.routineName || r}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit modal */}
            {showEdit && (
                <div className="pf-modal-overlay" onClick={() => setShowEdit(false)}>
                    <div className="pf-modal" onClick={e => e.stopPropagation()}>
                        <p className="pf-modal-title">Edit Profile</p>
                        <input className="pf-modal-input" name="username" placeholder="Username" onChange={handleEditChange} />
                        <input className="pf-modal-input" name="email" placeholder="Email" onChange={handleEditChange} />
                        <input className="pf-modal-input" name="password" type="password" placeholder="New password" onChange={handleEditChange} />
                        <input className="pf-modal-input" name="motto" placeholder="Motto" onChange={handleEditChange} />
                        <div className="pf-modal-actions">
                            <button className="pf-btn-ghost" onClick={() => setShowEdit(false)}>Cancel</button>
                            <button className="pf-btn-primary" onClick={saveProfile}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invite modal */}
            {showInvite && (
                <div className="pf-modal-overlay" onClick={() => setShowInvite(false)}>
                    <div className="pf-modal" onClick={e => e.stopPropagation()}>
                        <p className="pf-modal-title">Invite {selectedFriend?.username}</p>
                        <input className="pf-modal-input" type="date" onChange={e => setInviteData({ ...inviteData, date: e.target.value })} />
                        <input className="pf-modal-input" type="time" onChange={e => setInviteData({ ...inviteData, time: e.target.value })} />
                        <input className="pf-modal-input" placeholder="Message / workout title" onChange={e => setInviteData({ ...inviteData, message: e.target.value })} />
                        <div className="pf-modal-actions">
                            <button className="pf-btn-ghost" onClick={() => setShowInvite(false)}>Cancel</button>
                            <button className="pf-btn-primary" onClick={sendInvite}>Send Invite</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Profile;