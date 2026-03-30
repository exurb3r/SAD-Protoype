import React, { useState, useEffect } from "react";
import "../assets/Leaderboards.css";
const BOARDS = [
    { key: "topLevel",    label: "Top Level",      unit: "lvl",  icon: "▲" },
    { key: "topExp",      label: "Top EXP",         unit: "xp",   icon: "✦" },
    { key: "topStreak",   label: "Top Streak",      unit: "days", icon: "🔥" },
    { key: "topWorkouts", label: "Most Workouts",   unit: "",     icon: "◆" },
];
const RANK_STYLES = ["lb-gold", "lb-silver", "lb-bronze"];


function Leaderboard() {
    const [boards, setBoards] = useState({});

    useEffect(() => {
        fetch("http://localhost:3500/users/leaderboard", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => res.json())
        .then(data => setBoards(data))
        .catch(err => console.log(err));
    }, []);

    const renderBoard = (data, label, unit, icon) => {
        if (!data) return null;
        return (
            <div className="lb-card">
                <div className="lb-card-head">
                    <span className="lb-icon">{icon}</span>
                    <span className="lb-card-title">{label}</span>
                </div>
                <div className="lb-list">
                    {data.map((user, index) => (
                        <div className={`lb-row ${index < 3 ? RANK_STYLES[index] : ''}`} key={index}>
                            <span className="lb-rank">
                                {index === 0 ? "①" : index === 1 ? "②" : index === 2 ? "③" : `#${index + 1}`}
                            </span>
                            <span className="lb-username">{user.username}</span>
                            <span className="lb-score">
                                {(user.level ?? user.exp ?? user.streak ?? user.workouts)?.toLocaleString()}
                                {unit && <span className="lb-unit"> {unit}</span>}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="lb-page">
            <div className="lb-header">
                <h1 className="lb-title">Leaderboards</h1>
                <p className="lb-sub">See how you stack up against other members</p>
            </div>
            <div className="lb-grid">
                {BOARDS.map(b => renderBoard(boards[b.key], b.label, b.unit, b.icon))}
            </div>
        </div>
    );
}

export default Leaderboard;
