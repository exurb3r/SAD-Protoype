import React, { useState, useRef } from 'react';
import axios from "axios";
import { useNavigate, Navigate, NavLink } from "react-router-dom";
import "../assets/Login.css";

const MASKED_PHONE = "0951*********90";
const HARDCODED_CODE = "999999";

function TwoFAModal({ onVerify, onResend, error, resendMsg, verified }) {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputs = useRef([]);

    function handleChange(i, val) {
        if (!/^\d?$/.test(val)) return;
        const next = [...code];
        next[i] = val;
        setCode(next);
        if (val && i < 5) inputs.current[i + 1]?.focus();
    }

    function handleKeyDown(i, e) {
        if (e.key === 'Backspace' && !code[i] && i > 0) {
            inputs.current[i - 1]?.focus();
        }
    }

    function handlePaste(e) {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setCode(pasted.split(''));
            inputs.current[5]?.focus();
        }
        e.preventDefault();
    }

    return (
        <>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.92); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes checkDraw {
                    from { stroke-dashoffset: 60; }
                    to   { stroke-dashoffset: 0; }
                }
                @keyframes ripple {
                    0%   { transform: scale(0.8); opacity: 0.6; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                @keyframes successPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.3); }
                    50%      { box-shadow: 0 0 0 16px rgba(34,197,94,0); }
                }
                @keyframes progressFill {
                    from { width: 0%; }
                    to   { width: 100%; }
                }
                .success-card {
                    animation: fadeIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
                }
                .success-ring {
                    animation: successPulse 1.2s ease-in-out infinite;
                }
                .check-path {
                    stroke-dasharray: 60;
                    stroke-dashoffset: 60;
                    animation: checkDraw 0.5s ease 0.3s forwards;
                }
                .ripple-ring {
                    position: absolute; inset: 0;
                    border-radius: 50%;
                    border: 2px solid rgba(34,197,94,0.5);
                    animation: ripple 1.5s ease-out infinite;
                }
                .ripple-ring:nth-child(2) { animation-delay: 0.5s; }
                .ripple-ring:nth-child(3) { animation-delay: 1s; }
            `}</style>

            <div style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.75)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 999, padding: '16px'
            }}>
                {verified ? (
                    <div className="auth-card success-card" style={{ maxWidth: 360, gap: 0, alignItems: 'center', padding: '48px 28px', textAlign: 'center' }}>
                        <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 24 }}>
                            <div className="ripple-ring" />
                            <div className="ripple-ring" />
                            <div className="ripple-ring" />
                            <div className="success-ring" style={{
                                width: 80, height: 80, borderRadius: '50%',
                                background: 'rgba(34,197,94,0.1)',
                                border: '1.5px solid rgba(34,197,94,0.4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative', zIndex: 1
                            }}>
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                    <path
                                        className="check-path"
                                        d="M8 18 L15 25 L28 11"
                                        stroke="#4ade80"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>

                        <h2 className="auth-title" style={{ marginBottom: 8 }}>Identity Confirmed</h2>
                        <p className="auth-sub" style={{ marginBottom: 24 }}>Verification successful. Redirecting you to your dashboard...</p>

                        <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                background: 'linear-gradient(90deg, #16a34a, #4ade80)',
                                borderRadius: 99,
                                animation: 'progressFill 2.3s linear forwards'
                            }} />
                        </div>
                    </div>
                ) : (
                    <div className="auth-card" style={{ maxWidth: 360, gap: 20 }}>
                        <div className="auth-card-header">
                            <h2 className="auth-title">Verify it's you</h2>
                            <p className="auth-sub">
                                We sent a 6-digit code to <strong style={{ color: '#e5e5e5' }}>{MASKED_PHONE}</strong>
                            </p>
                        </div>

                        {error && (
                            <div className="auth-error">{error}</div>
                        )}

                        {resendMsg && (
                            <div style={{
                                background: 'rgba(34,197,94,0.1)',
                                border: '0.5px solid rgba(34,197,94,0.3)',
                                borderRadius: 8,
                                color: '#4ade80',
                                fontSize: 13,
                                padding: '10px 12px'
                            }}>
                                {resendMsg}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            {code.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={el => inputs.current[i] = el}
                                    className="auth-input"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleChange(i, e.target.value)}
                                    onKeyDown={e => handleKeyDown(i, e)}
                                    onPaste={handlePaste}
                                    style={{
                                        width: 44, height: 52,
                                        textAlign: 'center',
                                        fontSize: 20, fontWeight: 700,
                                        letterSpacing: 0, padding: 0
                                    }}
                                    autoFocus={i === 0}
                                />
                            ))}
                        </div>

                        <button
                            className="auth-btn"
                            onClick={() => onVerify(code.join(''))}
                            disabled={code.some(d => d === '')}
                        >
                            Verify & Sign In
                        </button>

                        <p className="auth-switch" style={{ margin: 0 }}>
                            Didn't receive it?{' '}
                            <button
                                onClick={onResend}
                                className="auth-link"
                                style={{
                                    background: 'none', border: 'none',
                                    cursor: 'pointer', padding: 0,
                                    fontFamily: 'inherit', fontSize: 'inherit'
                                }}
                            >
                                Resend code
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

function LogIn() {
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [show2FA, setShow2FA] = useState(false);
    const [twoFAError, setTwoFAError] = useState('');
    const [resendMsg, setResendMsg] = useState('');
    const [pendingData, setPendingData] = useState(null);
    const [verified, setVerified] = useState(false);
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
            setPendingData(response.data);
            setShow2FA(true);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    }

    function handleVerify(enteredCode) {
        if (enteredCode === HARDCODED_CODE) {
            setVerified(true);
            setTimeout(() => {
                localStorage.setItem("token", pendingData.token);
                localStorage.setItem("userCredentials", JSON.stringify(pendingData.user));
                navigate("/dashboard");
            }, 2500);
        } else {
            setTwoFAError("Incorrect code. Please try again.");
        }
    }

    function handleResend() {
        setTwoFAError('');
        setResendMsg('');
        setTimeout(() => setResendMsg('A new code has been sent.'), 300);
    }

    return (
        <>
            {show2FA && (
                <TwoFAModal
                    onVerify={handleVerify}
                    onResend={handleResend}
                    error={twoFAError}
                    resendMsg={resendMsg}
                    verified={verified}
                />
            )}

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
        </>
    );
}

export default LogIn;