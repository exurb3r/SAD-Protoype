import React, { useState, useEffect } from 'react';
import '../assets/Notif.css';

const API_BASE = 'http://localhost:3500/users/notifications';

// Helper to get JWT from storage
const getToken = () => localStorage.getItem('token'); // adjust key if needed

const TABS = [
    { key: "all",             label: "All" },
    { key: "announcement",    label: "Announcements" },
    { key: "friend_request",  label: "Friend Requests" },
    { key: "workout_invite",  label: "Invites" },
    { key: "friend_accepted", label: "Accepted" },
];

const TYPE_META = {
    announcement:    { label: "Announcement",   color: "blue",  icon: "📢" },
    friend_request:  { label: "Friend Request", color: "red",   icon: "👤" },
    workout_invite:  { label: "Workout Invite", color: "green", icon: "💪" },
    friend_accepted: { label: "Accepted",       color: "gray",  icon: "✓"  },
};

function NotifAvatar({ letter, color }) {
    return <div className={`notifpage-avatar notifpage-avatar-${color}`}>{letter}</div>;
}

function NotifCard({ notif, onRead, onAccept, onDecline }) {
    const meta = TYPE_META[notif.type] ?? TYPE_META.announcement;
    return (
        <div
            className={`notifpage-card ${notif.read ? "read" : "unread"}`}
            onClick={() => !notif.read && onRead(notif.id)}
        >
            <div className="notifpage-card-left">
                {notif.type === "announcement" ? (
                    <div className="notifpage-avatar notifpage-avatar-blue">📢</div>
                ) : (
                    <NotifAvatar letter={notif.avatar} color={meta.color} />
                )}
                {!notif.read && <span className="notifpage-unread-dot" />}
            </div>

            <div className="notifpage-card-body">
                <div className="notifpage-card-top">
                    <span className={`notifpage-type-badge notifpage-badge-${meta.color}`}>
                        {meta.label}
                    </span>
                    <span className="notifpage-timestamp">{notif.timestamp}</span>
                </div>

                {notif.type === "announcement" && (
                    <p className="notifpage-card-title">{notif.title}</p>
                )}

                <p className="notifpage-card-message">{notif.message}</p>

                {notif.detail && (
                    <p className="notifpage-card-detail">{notif.detail}</p>
                )}

                {(notif.type === "friend_request" || notif.type === "workout_invite") && !notif.read && (
                    <div className="notifpage-actions">
                        <button
                            className="notifpage-btn-accept"
                            onClick={e => { e.stopPropagation(); onAccept(notif); }}
                        >
                            Accept
                        </button>
                        <button
                            className="notifpage-btn-decline"
                            onClick={e => { e.stopPropagation(); onDecline(notif); }}
                        >
                            Decline
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab]         = useState("all");
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState(null);

    // ── Fetch on mount ──────────────────────────────────────────────
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch(API_BASE, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                if (!res.ok) throw new Error(`Error ${res.status}`);
                const data = await res.json();
                setNotifications(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    // ── Derived state ───────────────────────────────────────────────
    const unreadCount = notifications.filter(n => !n.read).length;
    const filtered    = activeTab === "all"
        ? notifications
        : notifications.filter(n => n.type === activeTab);

    // ── Handlers ────────────────────────────────────────────────────
    function markRead(id) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }

    function markAllRead() {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }

    async function handleAccept(notif) {
        const isFriend = notif.type === "friend_request";
        const url      = isFriend ? `${API_BASE}/friend/accept` : `${API_BASE}/invite/accept`;

        try {
            const res = await fetch(url, {
                method:  "POST",
                headers: {
                    "Content-Type":  "application/json",
                    Authorization:   `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ userId: notif.userId }),
            });
            if (!res.ok) throw new Error(`Error ${res.status}`);

            setNotifications(prev => prev.map(n =>
                n.id === notif.id
                    ? {
                        ...n,
                        read: true,
                        message: `You accepted ${n.fromUser}'s ${isFriend ? "friend request" : "workout invite"}.`,
                    }
                    : n
            ));
        } catch (err) {
            console.error("Accept failed:", err.message);
        }
    }

    async function handleDecline(notif) {
        const isFriend = notif.type === "friend_request";
        const url      = isFriend ? `${API_BASE}/friend/decline` : `${API_BASE}/invite/decline`;

        try {
            const res = await fetch(url, {
                method:  "POST",
                headers: {
                    "Content-Type":  "application/json",
                    Authorization:   `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ userId: notif.userId }),
            });
            if (!res.ok) throw new Error(`Error ${res.status}`);

            setNotifications(prev => prev.filter(n => n.id !== notif.id));
        } catch (err) {
            console.error("Decline failed:", err.message);
        }
    }

    // ── Render ───────────────────────────────────────────────────────
    if (loading) return <div className="notifpage-page"><p>Loading…</p></div>;
    if (error)   return <div className="notifpage-page"><p>Error: {error}</p></div>;

    return (
        <div className="notifpage-page">
            <div className="notifpage-header">
                <div>
                    <h1 className="notifpage-title">Notifications</h1>
                    <p className="notifpage-sub">
                        {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button className="notifpage-btn-markall" onClick={markAllRead}>
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="notifpage-tabs">
                {TABS.map(tab => {
                    const count = tab.key === "all"
                        ? notifications.filter(n => !n.read).length
                        : notifications.filter(n => n.type === tab.key && !n.read).length;
                    return (
                        <button
                            key={tab.key}
                            className={`notifpage-tab ${activeTab === tab.key ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                            {count > 0 && <span className="notifpage-tab-badge">{count}</span>}
                        </button>
                    );
                })}
            </div>

            <div className="notifpage-list">
                {filtered.length === 0 ? (
                    <div className="notifpage-empty"><p>No notifications here.</p></div>
                ) : (
                    filtered.map(notif => (
                        <NotifCard
                            key={notif.id}
                            notif={notif}
                            onRead={markRead}
                            onAccept={handleAccept}
                            onDecline={handleDecline}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Notifications;