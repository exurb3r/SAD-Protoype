import React, { useState, useEffect } from 'react';
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import "../assets/Login.css";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-.\+])[a-zA-Z\d!@#$%^&*()\-.\+]{8,}$/;
const emailRegex = /^[^\s@]+@gmail\.com$/;

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [spanPwd, setSpanPwd] = useState('');
    const [spanCPwd, setSpanCPwd] = useState('');
    const [spanEmail, setSpanEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    if (token) return <Navigate to="/dashboard" replace />;

    useEffect(() => {
        if (password === '') setSpanPwd('');
        else if (!passwordRegex.test(password)) setSpanPwd('Min 8 chars, 1 uppercase, 1 number, 1 special character');
        else setSpanPwd('');

        if (confirmPassword === '') setSpanCPwd('');
        else if (confirmPassword !== password) setSpanCPwd('Passwords do not match');
        else setSpanCPwd('');

        if (email === '') setSpanEmail('');
        else if (!emailRegex.test(email)) setSpanEmail('Must be a Gmail address');
        else setSpanEmail('');
    }, [username, password, confirmPassword, email]);

    const isFormValid = username && email && password && confirmPassword
        && !spanPwd && !spanCPwd && !spanEmail;

    const register = async (event) => {
        event.preventDefault();
        if (!isFormValid) return;
        setError('');
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3500/users/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Registration failed');
            }
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-brand">
                    <div className="auth-logo">AG</div>
                    <h1 className="auth-brand-name">Armztrong Gym</h1>
                    <p className="auth-brand-sub">Fitness Tracker</p>
                </div>
                <div className="auth-card">
                    <div className="auth-success">
                        <div className="auth-success-icon">✓</div>
                        <p className="auth-success-text">Account created! Redirecting to login...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-brand">
                <div className="auth-logo">AG</div>
                <h1 className="auth-brand-name">Armztrong Gym</h1>
                <p className="auth-brand-sub">Fitness Tracker</p>
            </div>

            <form onSubmit={register} className="auth-card">
                <div className="auth-card-header">
                    <h2 className="auth-title">Create account</h2>
                    <p className="auth-sub">Start your fitness journey today</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <div className="auth-fields">
                    <div className="auth-field">
                        <label className="auth-label">Username</label>
                        <input
                            className="auth-input"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            autoComplete="username"
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Email</label>
                        <input
                            className={`auth-input ${spanEmail ? 'invalid' : email && !spanEmail ? 'valid' : ''}`}
                            type="text"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@gmail.com"
                            autoComplete="email"
                        />
                        {spanEmail && <span className="auth-field-error">{spanEmail}</span>}
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Password</label>
                        <input
                            className={`auth-input ${spanPwd ? 'invalid' : password && !spanPwd ? 'valid' : ''}`}
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                        {spanPwd && <span className="auth-field-error">{spanPwd}</span>}
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Confirm Password</label>
                        <input
                            className={`auth-input ${spanCPwd ? 'invalid' : confirmPassword && !spanCPwd ? 'valid' : ''}`}
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                        {spanCPwd && <span className="auth-field-error">{spanCPwd}</span>}
                    </div>
                </div>

                {/* Password strength hints */}
                {password && (
                    <div className="auth-hints">
                        <span className={`auth-hint ${password.length >= 8 ? 'pass' : ''}`}>8+ chars</span>
                        <span className={`auth-hint ${/[A-Z]/.test(password) ? 'pass' : ''}`}>Uppercase</span>
                        <span className={`auth-hint ${/\d/.test(password) ? 'pass' : ''}`}>Number</span>
                        <span className={`auth-hint ${/[!@#$%^&*()\-.\+]/.test(password) ? 'pass' : ''}`}>Special</span>
                    </div>
                )}

                <button className="auth-btn" type="submit" disabled={loading || !isFormValid}>
                    {loading ? "Creating account..." : "Create Account"}
                </button>

                <p className="auth-switch">
                    Already have an account? <NavLink to="/login" className="auth-link">Sign In</NavLink>
                </p>
            </form>
        </div>
    );
}

export default SignUp;
