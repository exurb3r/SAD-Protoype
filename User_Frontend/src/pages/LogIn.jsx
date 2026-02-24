import React, { useState } from 'react';
import axios from "axios";
import { useNavigate, Navigate, NavLink } from "react-router-dom";
import "../assets/Login.css";

function LogIn(){
    const [inputEmail, setInputEmail ] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
 
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    async function getUser(event){
        event.preventDefault();
        try{
            const response = await axios.post("http://localhost:3500/users/auth/login", {
                email: inputEmail,
                password: inputPassword
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userCredentials", JSON.stringify(response.data.user));
            navigate("/dashboard");

        } catch (err){
            console.error(err.response?.data || err.message);
        } 
    }

    return(
        <div className="loginPage">
            <form onSubmit={getUser} className='loginCard'>
                <h1 className="loginTitle">Sign In</h1>

                <input 
                    type='text' 
                    value={inputEmail} 
                    onChange={(e) => setInputEmail(e.target.value)} 
                    placeholder="Email"
                    className="loginInput"
                />

                <input 
                    type='password' 
                    value={inputPassword} 
                    onChange={(e) => setInputPassword(e.target.value)} 
                    placeholder="Password"
                    className="loginInput"
                />

                <button className="loginButton">Sign In</button>
                <p> Don't have an account? <NavLink to={"/signup"}> Sign Up</NavLink></p>
            </form>
        </div>
    );
}

export default LogIn;
