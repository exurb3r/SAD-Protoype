import React, { useState, useEffect } from 'react';
import { Navigate, NavLink } from "react-router-dom";

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [spanPwd, setSpanPwd] = useState('');
    const [spanCPwd, setSpanCPwd] = useState('');
    const [spanEmail, setSpanEmail] = useState('');

    const token = localStorage.getItem("token");   
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    // Real-time validation
    useEffect(() => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-.\+])[a-zA-Z\d!@#$%^&*()\-.\+]{8,}$/;
        const emailPattern = /^[^\s@]+@gmail\.com$/;

        // Password validation
        if(password === '') setSpanPwd('');
        else if(!passwordRegex.test(password)) setSpanPwd('Password must contain 1 uppercase, 1 lowercase, 1 number, 1 special char, min 8 chars');
        else setSpanPwd('');

        // Confirm password
        if(confirmPassword === '') setSpanCPwd('');
        else if(confirmPassword !== password) setSpanCPwd('Passwords do not match');
        else setSpanCPwd('');

        // Email
        if(email === '') setSpanEmail('');
        else if(!emailPattern.test(email)) setSpanEmail('Invalid Gmail address');
        else setSpanEmail('');
    }, [username, password, confirmPassword, email]);

    const register = async (event) => {
        event.preventDefault();

        if(username === '' || email === '' || password === '' || confirmPassword === ''){
            return console.log('All fields must be filled');
        }
        if(confirmPassword !== password || spanPwd || spanCPwd || spanEmail){
            return console.log("Invalid credentials");
        }

        const userInfo = {
            username,
            email,
            password
        }

        try {
            const response = await fetch('http://localhost:3500/users/auth/signup',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userInfo)
            });

            if(!response.ok){
                throw new Error('Failed to register user');
            }

            const result = await response.json();
            console.log(result);

            // Reset fields
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

        } catch (err) {
            console.error("Fetch Error:", err.message);
        }
    }

    return (
        <div className="loginPage">
            <h1>Sign Up</h1>
            <form onSubmit={register} className='loginCard'>
                <input
                    type='text'
                    value={username}
                    className="loginInput"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type='password'
                    value={password}
                    className="loginInput"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <span>{spanPwd}</span>

                <input
                    type='password'
                    value={confirmPassword}
                    className="loginInput"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                />
                <span>{spanCPwd}</span>

                <input
                    type='text'
                    value={email}
                    className="loginInput"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email (Gmail only)"
                />
                <span>{spanEmail}</span>

                <button type="submit">Sign Up</button>
                <p>Already have an account? <NavLink to="/login">Log In</NavLink></p>
            </form>
        </div>
    );
}

export default SignUp;