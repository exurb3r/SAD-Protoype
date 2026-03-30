import React, { useState } from 'react';
import axios from "axios";
import { useNavigate, Navigate, NavLink } from "react-router-dom";
import "../assets/Login.css";

function LogIn() {
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    if (token) return <Navigate to="/dashboard" replace />;

    async function getUser(event) {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:3500/users/auth/login", {
                email: inputEmail,
                password: inputPassword
            });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userCredentials", JSON.stringify(response.data.user));
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-brand">
                <div className="auth-logo">AG</div>
                <h1 className="auth-brand-name">Armztrong Gym</h1>
                <p className="auth-brand-sub">Fitness Tracker</p>
            </div>

            <form onSubmit={getUser} className="auth-card">
                <div className="auth-card-header">
                    <h2 className="auth-title">Welcome back</h2>
                    <p className="auth-sub">Sign in to your account</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <div className="auth-fields">
                    <div className="auth-field">
                        <label className="auth-label">Email</label>
                        <input
                            className="auth-input"
                            type="text"
                            value={inputEmail}
                            onChange={e => setInputEmail(e.target.value)}
                            placeholder="you@gmail.com"
                            autoComplete="email"
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Password</label>
                        <input
                            className="auth-input"
                            type="password"
                            value={inputPassword}
                            onChange={e => setInputPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </div>
                </div>

                <button className="auth-btn" type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                </button>

                <p className="auth-switch">
                    Don't have an account? <NavLink to="/signup" className="auth-link">Sign Up</NavLink>
                </p>
            </form>
        </div>
    );
}

export default LogIn;
