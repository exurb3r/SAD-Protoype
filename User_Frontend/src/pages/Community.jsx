import React, { useState, useEffect } from 'react';
import '../assets/Community.css';

const DUMMY_COACHES = [
    { name: "Coach Marco", role: "Strength & Conditioning", avatar: "M", bio: "10 years coaching competitive athletes. Specializes in powerlifting and hypertrophy." },
    { name: "Coach Sarah", role: "Cardio & HIIT",           avatar: "S", bio: "Certified CrossFit trainer with a focus on endurance and fat loss." },
    { name: "Coach Dan",   role: "Mobility & Recovery",     avatar: "D", bio: "Physical therapist turned coach. Helps athletes move better and recover faster." },
];

function Community() {
    const [users, setUsers] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("http://localhost:3500/users/community/users", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => res.json())
        .then(data => {
            setUsers(data);
            setSentRequests(data.filter(u => u.requestSent).map(u => u.email));
        })
        .catch(err => console.log(err));

        fetch("http://localhost:3500/users/community/announcements", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => res.json())
        .then(data => setAnnouncements(data))
        .catch(err => console.log(err));
    }, []);

    const addFriend = async (email) => {
        try {
            await fetch("http://localhost:3500/users/community/addfriend", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: JSON.stringify({ email })
            });
            setSentRequests(prev => [...prev, email]);
        } catch (err) { console.log(err); }
    };

    const cancelRequest = async (email) => {
        try {
            await fetch("http://localhost:3500/users/community/cancelrequest", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: JSON.stringify({ email })
            });
            setSentRequests(prev => prev.filter(e => e !== email));
        } catch (err) { console.log(err); }
    };

    const filteredUsers = users.filter(u =>
        u.username?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="cm-page">

            {/* Header */}
            <div className="cm-header">
                <h1 className="cm-title">Community</h1>
                <p className="cm-sub">Connect with members, meet coaches, stay updated</p>
            </div>

            {/* Coaches  */}
            <section className="cm-section">
                <div className="cm-section-head">
                    <p className="cm-section-label">Meet the Coaches</p>
                </div>
                <div className="cm-coaches-row">
                    {DUMMY_COACHES.map((coach, i) => (
                        <div key={i} className="cm-coach-card">
                            <div className="cm-coach-avatar">{coach.avatar}</div>
                            <div className="cm-coach-info">
                                <p className="cm-coach-name">{coach.name}</p>
                                <p className="cm-coach-role">{coach.role}</p>
                                <p className="cm-coach-bio">{coach.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Find Friends */}
            <section className="cm-section">
                <div className="cm-section-head">
                    <p className="cm-section-label">Find Friends</p>
                    <span className="cm-count">{users.length} members</span>
                </div>

                <div className="cm-search-row">
                    <input
                        className="cm-search-input"
                        type="text"
                        placeholder="Search by username..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="cm-friends-grid">
                    {filteredUsers.length === 0 && (
                        <p className="cm-empty">No members found.</p>
                    )}
                    {filteredUsers.map(user => (
                        <div key={user.email} className="cm-friend-card">
                            <div className="cm-friend-avatar">
                                {user.username?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div className="cm-friend-info">
                                <p className="cm-friend-name">{user.username}</p>
                                <p className="cm-friend-meta">Level {user.level}</p>
                            </div>
                            <button
                                className={`cm-friend-btn ${sentRequests.includes(user.email) ? "sent" : ""}`}
                                onClick={() => sentRequests.includes(user.email)
                                    ? cancelRequest(user.email)
                                    : addFriend(user.email)
                                }
                            >
                                {sentRequests.includes(user.email) ? "Cancel" : "+ Add"}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/*  Announcements  */}
            <section className="cm-section">
                <div className="cm-section-head">
                    <p className="cm-section-label">Announcements</p>
                    <span className="cm-count">{announcements.length} posts</span>
                </div>

                <div className="cm-announcements-list">
                    {announcements.length === 0 && (
                        <p className="cm-empty">No announcements yet.</p>
                    )}
                    {announcements.map((post, index) => (
                        <div key={index} className="cm-announcement-card">
                            <div className="cm-announcement-head">
                                <div className="cm-announcer-avatar">
                                    {post.email?.[0]?.toUpperCase() || "A"}
                                </div>
                                <div className="cm-announcer-info">
                                    <p className="cm-announcer-name">{post.email}</p>
                                    <p className="cm-announcement-date">
                                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <span className="cm-announcement-badge">Announcement</span>
                            </div>
                            <p className="cm-announcement-body">{post.contents}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}

export default Community;
