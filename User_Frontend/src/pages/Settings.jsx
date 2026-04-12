import React, { useState, useEffect } from 'react';
import '../assets/Settings.css';

const TABS = ["profile", "security", "notifications"];
const TAB_LABELS = { profile: "My Profile", security: "Security", notifications: "Notifications" };
const TAB_ICONS = { profile: "👤", security: "🔒", notifications: "🔔" };

function Settings() {
    const token = localStorage.getItem("token");

    const [tab, setTab] = useState("profile");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: "success", msg: "" });

    // Profile
    const [profileData, setProfileData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        motto: ""
    });

    // Password
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordError, setPasswordError] = useState("");

    // Notifications
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        workoutReminders: true,
        friendRequests: true,
        achievementAlerts: true,
        weeklyReport: false
    });

    // Security
    const [security, setSecurity] = useState({
        twoFactorAuth: false,
        sessionTimeout: 30
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("http://localhost:3500/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setProfileData({
                    username: data.username || "",
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    address: data.address || "",
                    motto: data.motto || ""
                });
            } catch (err) { console.error(err); }
        };
        fetchProfile();
    }, [token]);

    function showToast(type, msg) {
        setToast({ show: true, type, msg });
        setTimeout(() => setToast({ show: false, type: "success", msg: "" }), 3000);
    }

    async function saveProfile() {
        setLoading(true);
        try {
            await fetch("http://localhost:3500/users/profile/edit", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(profileData)
            });
            showToast("success", "Profile updated successfully!");
        } catch (err) {
            showToast("error", "Failed to save profile.");
        } finally { setLoading(false); }
    }

    async function changePassword() {
        setPasswordError("");
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setPasswordError("All fields are required.");
            return;
        }
        if (passwordData.newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters.");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            await fetch("http://localhost:3500/users/profile/password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
            });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            showToast("success", "Password changed successfully!");
        } catch (err) {
            showToast("error", "Failed to change password.");
        } finally { setLoading(false); }
    }

    async function saveNotifications() {
        setLoading(true);
        try {
            await fetch("http://localhost:3500/users/profile/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(notifications)
            });
            showToast("success", "Notification preferences saved!");
        } catch (err) {
            showToast("error", "Failed to save preferences.");
        } finally { setLoading(false); }
    }

    return (
        <div className="st-page">

            {/* Toast */}
            {toast.show && (
                <div className={`st-toast ${toast.type}`}>
                    {toast.type === "success" ? "✅" : "❌"} {toast.msg}
                </div>
            )}

            <div className="st-header">
                <h1 className="st-title">Settings</h1>
                <p className="st-sub">Manage your account and preferences</p>
            </div>

            <div className="st-layout">

                {/* Sidebar */}
                <div className="st-sidebar">
                    {TABS.map(t => (
                        <button
                            key={t}
                            className={`st-tab-btn ${tab === t ? "active" : ""}`}
                            onClick={() => setTab(t)}
                        >
                            <span className="st-tab-icon">{TAB_ICONS[t]}</span>
                            {TAB_LABELS[t]}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="st-main">

                    {/* ── PROFILE ── */}
                    {tab === "profile" && (
                        <div className="st-section">
                            <p className="st-section-label">My Profile</p>
                            <p className="st-section-desc">Update your personal information</p>

                            <div className="st-panel">
                                <p className="st-panel-title">Account Details</p>

                                <div className="st-form-group">
                                    <label>Username</label>
                                    <input
                                        className="st-input"
                                        value={profileData.username}
                                        onChange={e => setProfileData({ ...profileData, username: e.target.value })}
                                        placeholder="Your username"
                                    />
                                </div>

                                <div className="st-form-row">
                                    <div className="st-form-group">
                                        <label>First Name</label>
                                        <input
                                            className="st-input"
                                            value={profileData.firstName}
                                            onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                                            placeholder="First name"
                                        />
                                    </div>
                                    <div className="st-form-group">
                                        <label>Last Name</label>
                                        <input
                                            className="st-input"
                                            value={profileData.lastName}
                                            onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                                            placeholder="Last name"
                                        />
                                    </div>
                                </div>

                                <div className="st-form-group">
                                    <label>Email Address</label>
                                    <input
                                        className="st-input"
                                        type="email"
                                        value={profileData.email}
                                        onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <div className="st-form-group">
                                    <label>Address</label>
                                    <textarea
                                        className="st-input st-textarea"
                                        value={profileData.address}
                                        onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                                        placeholder="Your address"
                                        rows={3}
                                    />
                                </div>

                                <div className="st-form-group">
                                    <label>Motto <span className="st-label-hint">— shown on your profile</span></label>
                                    <input
                                        className="st-input"
                                        value={profileData.motto}
                                        onChange={e => setProfileData({ ...profileData, motto: e.target.value })}
                                        placeholder="e.g. No pain, no gain"
                                    />
                                </div>
                            </div>

                            <button className="st-btn-primary" onClick={saveProfile} disabled={loading}>
                                {loading ? "Saving..." : "💾 Save Profile"}
                            </button>
                        </div>
                    )}

                    {/* ── SECURITY ── */}
                    {tab === "security" && (
                        <div className="st-section">
                            <p className="st-section-label">Security</p>
                            <p className="st-section-desc">Manage your password and account security</p>

                            {/* Change password */}
                            <div className="st-panel">
                                <p className="st-panel-title">Change Password</p>

                                {passwordError && (
                                    <div className="st-inline-msg error">❌ {passwordError}</div>
                                )}

                                <div className="st-form-group">
                                    <label>Current Password</label>
                                    <input
                                        className="st-input"
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className="st-form-group">
                                    <label>New Password</label>
                                    <input
                                        className="st-input"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        placeholder="Minimum 8 characters"
                                    />
                                </div>
                                <div className="st-form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        className="st-input"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="Re-enter new password"
                                    />
                                </div>

                                <button className="st-btn-primary" onClick={changePassword} disabled={loading}>
                                    {loading ? "Updating..." : "🔑 Update Password"}
                                </button>
                            </div>

                            {/* Auth toggles */}
                            <div className="st-panel">
                                <p className="st-panel-title">Authentication</p>
                                <div className="st-setting-item">
                                    <div className="st-setting-info">
                                        <div className="st-setting-label">Two-Factor Authentication</div>
                                        <div className="st-setting-desc">Add an extra layer of security to your account</div>
                                    </div>
                                    <label className="st-toggle">
                                        <input
                                            type="checkbox"
                                            checked={security.twoFactorAuth}
                                            onChange={e => setSecurity({ ...security, twoFactorAuth: e.target.checked })}
                                        />
                                        <span className="st-toggle-slider" />
                                    </label>
                                </div>
                            </div>

                            {/* Session */}
                            <div className="st-panel">
                                <p className="st-panel-title">Session</p>
                                <div className="st-form-group" style={{ maxWidth: 220 }}>
                                    <label>Session Timeout (minutes)</label>
                                    <input
                                        className="st-input"
                                        type="number"
                                        min={5}
                                        max={120}
                                        value={security.sessionTimeout}
                                        onChange={e => setSecurity({ ...security, sessionTimeout: e.target.value })}
                                    />
                                    <small className="st-hint">Auto-logout after inactivity</small>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── NOTIFICATIONS ── */}
                    {tab === "notifications" && (
                        <div className="st-section">
                            <p className="st-section-label">Notifications</p>
                            <p className="st-section-desc">Choose what you want to be notified about</p>

                            <div className="st-panel">
                                <p className="st-panel-title">Activity</p>
                                {[
                                    { key: "workoutReminders", label: "Workout Reminders", desc: "Get reminded about your scheduled workouts" },
                                    { key: "achievementAlerts", label: "Achievement Alerts", desc: "Be notified when you earn a new achievement" },
                                    { key: "weeklyReport", label: "Weekly Report", desc: "Receive a weekly summary of your progress" },
                                ].map(item => (
                                    <div className="st-setting-item" key={item.key}>
                                        <div className="st-setting-info">
                                            <div className="st-setting-label">{item.label}</div>
                                            <div className="st-setting-desc">{item.desc}</div>
                                        </div>
                                        <label className="st-toggle">
                                            <input
                                                type="checkbox"
                                                checked={notifications[item.key]}
                                                onChange={e => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                            />
                                            <span className="st-toggle-slider" />
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="st-panel">
                                <p className="st-panel-title">Social</p>
                                {[
                                    { key: "friendRequests", label: "Friend Requests", desc: "Get notified when someone sends you a friend request" },
                                    { key: "emailNotifications", label: "Email Notifications", desc: "Receive notifications via email" },
                                ].map(item => (
                                    <div className="st-setting-item" key={item.key}>
                                        <div className="st-setting-info">
                                            <div className="st-setting-label">{item.label}</div>
                                            <div className="st-setting-desc">{item.desc}</div>
                                        </div>
                                        <label className="st-toggle">
                                            <input
                                                type="checkbox"
                                                checked={notifications[item.key]}
                                                onChange={e => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                            />
                                            <span className="st-toggle-slider" />
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <button className="st-btn-primary" onClick={saveNotifications} disabled={loading}>
                                {loading ? "Saving..." : "💾 Save Preferences"}
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Settings;
