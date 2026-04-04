import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    BarElement, ArcElement, Tooltip, Legend
} from "chart.js";
import '../assets/FriendProfile.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const TABS = ["overview", "stats", "achievements", "routine"];
const TAB_LABELS = { overview: "Overview", stats: "Stats", achievements: "Achievements", routine: "Shared Routines" };

function FriendProfile() {
    const { id }       = useParams();
    const navigate     = useNavigate();
    const token        = localStorage.getItem("token");

    const [tab, setTab]                         = useState("overview");
    const [loading, setLoading]                 = useState(true);
    const [error, setError]                     = useState(null);
    const [profile, setProfile]                 = useState(null);
    const [friends, setFriends]                 = useState([]);
    const [achievements, setAchievements]       = useState([]);
    const [sharedRoutines, setSharedRoutines]   = useState([]);
    const [workoutsPerWeek, setWorkoutsPerWeek] = useState([0,0,0,0,0,0,0]);
    const [workoutDist, setWorkoutDist]         = useState([0,0,0,0,0,0]);

    // Relationship state
    const [isFriend, setIsFriend]         = useState(false);
    const [requestSent, setRequestSent]   = useState(false);

    // Invite modal
    const [showInvite, setShowInvite]   = useState(false);
    const [inviteData, setInviteData]   = useState({ date: "", time: "", message: "" });

    useEffect(() => {
        const fetch_ = async () => {
            try {
                setLoading(true);

                // Fetch friend's profile
                const res = await fetch(`http://localhost:3500/users/profile/view/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error(`Error ${res.status}`);
                const data = await res.json();

                setProfile({
                    username: data.username,
                    level:    data.level,
                    exp:      data.exp,
                    expNext:  data.expNext,
                    motto:    data.motto,
                    joined:   new Date(data.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    streak:   data.streak,
                });
                setFriends(data.friends           || []);
                setAchievements(data.achievements  || []);
                setSharedRoutines(data.sharedRoutines || []);
                setWorkoutsPerWeek(data.weeklyWorkouts    || [0,0,0,0,0,0,0]);
                setWorkoutDist(data.workoutDistribution   || [0,0,0,0,0,0]);
                setIsFriend(data.isFriend       ?? false);
                setRequestSent(data.requestSent ?? false);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetch_();
    }, [id, token]);

    // ── Actions ────────────────────────────────────────────────────
    const addFriend = async () => {
        try {
            await fetch("http://localhost:3500/users/community/addfriend", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ email: profile.email })
            });
            setRequestSent(true);
        } catch (err) { console.error(err); }
    };

    const cancelRequest = async () => {
        try {
            await fetch("http://localhost:3500/users/community/cancelrequest", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ email: profile.email })
            });
            setRequestSent(false);
        } catch (err) { console.error(err); }
    };

    const unfriend = async () => {
        if (!confirm(`Remove ${profile.username} as a friend?`)) return;
        try {
            await fetch(`http://localhost:3500/users/profile/unfriend/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFriend(false);
        } catch (err) { console.error(err); }
    };

    const sendInvite = async () => {
        try {
            await fetch("http://localhost:3500/users/profile/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ friendId: id, ...inviteData })
            });
            setShowInvite(false);
            setInviteData({ date: "", time: "", message: "" });
        } catch (err) { console.error(err); }
    };

    // ── Loading / error ───────────────────────────────────────────
    if (loading) return (
        <div className="fp-page fp-center">
            <div className="fp-spinner" />
            <p className="fp-loading-text">Loading profile…</p>
        </div>
    );

    if (error || !profile) return (
        <div className="fp-page fp-center">
            <p className="fp-error">Couldn't load this profile.</p>
            <button className="fp-btn-back" onClick={() => navigate(-1)}>← Go back</button>
        </div>
    );

    const expPercent = profile.expNext
        ? Math.round((profile.exp / profile.expNext) * 100)
        : 0;

    const chartAxisStyle = {
        ticks: { color: '#555' },
        grid:  { color: 'rgba(255,255,255,0.04)' }
    };

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
            data: workoutDist,
            backgroundColor: ["#dc2626","#f87171","#ffffff","#9ca3af","#4b4b4b","#1f1f1f"],
            borderWidth: 0,
            borderRadius: 4
        }]
    };

    return (
        <div className="fp-page">

            <button className="fp-btn-back" onClick={() => navigate(-1)}>← Back</button>

            {/* Identity card */}
            <div className="fp-card fp-identity-card">
                <div className="fp-identity-upper">
                    <div className="fp-avatar">
                        <span>{profile.username?.[0]?.toUpperCase() || "?"}</span>
                    </div>
                    <div className="fp-identity-info">
                        <div className="fp-identity-row">
                            <span className="fp-username">{profile.username}</span>
                            <span className="fp-level-badge">Lvl {profile.level}</span>
                            <span className="fp-xp-badge">{profile.exp?.toLocaleString()} xp</span>

                            {/* ── Action buttons ── */}
                            <div className="fp-profile-actions">
                                {isFriend ? (
                                    <>
                                        <button className="fp-btn-invite" onClick={() => setShowInvite(true)}>
                                            Invite to Workout
                                        </button>
                                        <button className="fp-btn-unfriend" onClick={unfriend}>
                                            Unfriend
                                        </button>
                                    </>
                                ) : requestSent ? (
                                    <button className="fp-btn-ghost" onClick={cancelRequest}>
                                        Cancel Request
                                    </button>
                                ) : (
                                    <button className="fp-btn-invite" onClick={addFriend}>
                                        + Add Friend
                                    </button>
                                )}
                            </div>
                        </div>

                        <p className="fp-motto">{profile.motto || "No motto set."}</p>
                        <div className="fp-meta-row">
                            <span>Joined {profile.joined}</span>
                            <span>·</span>
                            <span>{friends.length} friends</span>
                            <span>·</span>
                            <span>{profile.streak} day streak</span>
                        </div>
                    </div>
                </div>

                <div className="fp-tabs">
                    {TABS.map(t => (
                        <button
                            key={t}
                            className={`fp-tab ${tab === t ? "active" : ""}`}
                            onClick={() => setTab(t)}
                        >
                            {TAB_LABELS[t]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content */}
            <div className="fp-card fp-content-card">

                {tab === "overview" && (
                    <div className="fp-overview">
                        <p className="fp-card-label">Gamification Overview</p>
                        <div className="fp-overview-hero">
                            <div className="fp-ring">
                                <CircularProgressbar
                                    value={expPercent}
                                    text={`${expPercent}%`}
                                    styles={buildStyles({
                                        textColor:    '#fff',
                                        textSize:     '18px',
                                        pathColor:    '#dc2626',
                                        trailColor:   'rgba(255,255,255,0.07)',
                                        strokeLinecap:'round',
                                    })}
                                />
                            </div>
                            <div className="fp-overview-meta">
                                <p className="fp-overview-exp">
                                    {profile.exp} <span>/ {profile.expNext} XP</span>
                                </p>
                                <div className="fp-exp-bar-bg">
                                    <div className="fp-exp-bar-fill" style={{ width: `${expPercent}%` }} />
                                </div>
                                <p className="fp-exp-caption">{expPercent}% to next level</p>
                            </div>
                        </div>
                        <div className="fp-stat-grid">
                            <div className="fp-stat-box"><span className="fp-stat-label">Streak</span><span className="fp-stat-value">{profile.streak} days</span></div>
                            <div className="fp-stat-box"><span className="fp-stat-label">Total XP</span><span className="fp-stat-value">{profile.exp?.toLocaleString()}</span></div>
                            <div className="fp-stat-box"><span className="fp-stat-label">Friends</span><span className="fp-stat-value">{friends.length}</span></div>
                            <div className="fp-stat-box"><span className="fp-stat-label">Achievements</span><span className="fp-stat-value">{achievements.length}</span></div>
                        </div>
                    </div>
                )}

                {tab === "stats" && (
                    <div className="fp-stats">
                        <p className="fp-card-label">Workout Stats</p>
                        <div className="fp-charts-grid">
                            <div className="fp-chart-wrap">
                                <p className="fp-chart-title">Weekly Workouts</p>
                                <div className="fp-chart-inner">
                                    <Bar data={barData} options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { labels: { color: '#888', font: { size: 11 } } } },
                                        scales: { x: chartAxisStyle, y: { ...chartAxisStyle, beginAtZero: true } }
                                    }} />
                                </div>
                            </div>
                            <div className="fp-chart-wrap">
                                <p className="fp-chart-title">Muscle Split</p>
                                <div className="fp-chart-inner">
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

                {tab === "achievements" && (
                    <div className="fp-achievements">
                        <p className="fp-card-label">Achievements ({achievements.length})</p>
                        {achievements.length === 0 && <p className="fp-empty">No achievements yet.</p>}
                        <div className="fp-stat-grid">
                            {achievements.map((a, i) => (
                                <div key={a._id || i} className="fp-achieve-card">
                                    <p className="fp-achieve-title">{a.title}</p>
                                    <p className="fp-achieve-desc">{a.description}</p>
                                    <span className="fp-achieve-xp">+{a.exp_gained} XP</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === "routine" && (
                    <div className="fp-routines">
                        <p className="fp-card-label">Shared Routines ({sharedRoutines.length})</p>
                        {sharedRoutines.length === 0 && <p className="fp-empty">No shared routines.</p>}
                        {sharedRoutines.map((r, i) => (
                            <div key={i} className="fp-routine-row">
                                <span>{r.routineName || r}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Friends list */}
            <div className="fp-card">
                <p className="fp-card-label">Friends ({friends.length})</p>
                {friends.length === 0 && <p className="fp-empty">No friends yet.</p>}
                {friends.map(friend => (
                    <div
                        key={friend.userId}
                        className="fp-friend-row"
                        onClick={() => navigate(`/friend/${friend.userId}`)}
                    >
                        <div className="fp-friend-avatar">
                            {friend.username?.[0]?.toUpperCase()}
                        </div>
                        <span className="fp-friend-name">{friend.username}</span>
                        <span className="fp-friend-arrow">→</span>
                    </div>
                ))}
            </div>

            {/* Invite modal */}
            {showInvite && (
                <div className="fp-modal-overlay" onClick={() => setShowInvite(false)}>
                    <div className="fp-modal" onClick={e => e.stopPropagation()}>
                        <p className="fp-modal-title">Invite {profile.username}</p>
                        <input
                            className="fp-modal-input" type="date"
                            onChange={e => setInviteData({ ...inviteData, date: e.target.value })}
                        />
                        <input
                            className="fp-modal-input" type="time"
                            onChange={e => setInviteData({ ...inviteData, time: e.target.value })}
                        />
                        <input
                            className="fp-modal-input" placeholder="Message / workout title"
                            onChange={e => setInviteData({ ...inviteData, message: e.target.value })}
                        />
                        <div className="fp-modal-actions">
                            <button className="fp-btn-ghost" onClick={() => setShowInvite(false)}>Cancel</button>
                            <button className="fp-btn-primary" onClick={sendInvite}>Send Invite</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default FriendProfile;