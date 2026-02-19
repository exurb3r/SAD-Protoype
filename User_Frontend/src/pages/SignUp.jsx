import React, { useState, useEffect} from 'react';
import { useNavigate, Navigate, NavLink } from "react-router-dom";

function SignUp(){
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contactNum, setContacNum] = useState('');
    const [address, setAddress] = useState('');

    const [spanFn, setSpanFn] = useState('');
    const [spanLn, setSpanLn] = useState('');
    const [spanPwd, setSpanPwd] = useState('');
    const [spanCPwdm, setSpanCPwd] = useState('');
    const [spanEmail, setSpanEmail] = useState('');

    const token = localStorage.getItem("token");   
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }



    function checker(){
        const namePattern = /^[A-Za-z\s]+$/;
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-.+])[a-zA-Z\d!@#$%^&*()-.+]{8,}$/;
        const emailPattern = /^[^\s@]+@gmail\.com$/;

        if(firstname === ''){
            setSpanFn('');
        }
        else if(!namePattern.test(firstname)){
            setSpanFn('Invalid');
        } else{
            setSpanFn('');
        }

        if(lastname === ''){
            setSpanLn('');
        }
        else if(!namePattern.test(lastname)){
            setSpanLn('Invalid');
        } else {
            setSpanLn('');
        }


        if(password === ''){
            setSpanPwd('');
        }
        else if(!regex.test(password)){
            setSpanPwd('Invalid');
        } else {
            setSpanPwd('');
        }


        if(confirmPassword === ''){
            setSpanCPwd('');
        }
        else if(confirmPassword !== password){
            setSpanCPwd('Passwords do not match');
        } else {
            setSpanCPwd('');
        }


        if(email === ''){
            setSpanEmail('');
        }
        else if(!emailPattern.test(email)){
            setSpanEmail('Invalid email');
        } else {
            setSpanEmail('');

        }
    }

    async function register(event){
        event.preventDefault();
        const emailPattern = /^[^\s@]+@gmail\.com$/;
        const namePattern = /^[A-Za-z\s]+$/;
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-.+])[a-zA-Z\d!@#$%^&*()-.+]{8,}$/;

        if(firstname === '' || lastname === '' || username === '' || email === '' || password=== '' || contactNum === '' || address === ''){
            return console.log('Needs All Credentials to be filled');
        }
     
        if(!namePattern.test(firstname) || !namePattern.test(lastname) || confirmPassword !== password || !emailPattern.test(email)){
            return console.log("Invalid Credentials");

        }

        const userInfo ={
            firstname,
            lastname,
            username,
            email,
            password,
            contactNum,
            address
        }

        try{
            const response = await fetch('http://localhost:3500/userRegister/addUser',{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(userInfo)
            });

            if(!response.ok){
                throw new Error('Failed Add User');
            }

            const updates = await response.json();
            console.log(updates)

            setFirstname('');
            setLastname('');
            setEmail('');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setAddress('');
            setContacNum('');
            
        } catch (err){
            console.error(err);
        }
    }

    useEffect(() => {
    checker();
    }, [firstname, lastname, password, confirmPassword, email]);

    return(
        <div className="loginPage">
            <h1>Sign Up</h1>
            <form onSubmit={register} className='loginCard'>
                <span>{spanFn}</span>
                <input type='text' value={firstname} className="loginInput" onChange={(e) => setFirstname(e.target.value)} placeholder="First Name"></input>
                <span>{spanLn}</span>
                <input type='text' value={lastname} className="loginInput" onChange={(e) => setLastname(e.target.value)} placeholder="Last Name"></input>
                <span></span>
                <input type='text' value={username} className="loginInput" onChange={(e) => setUsername(e.target.value)} placeholder="Username"></input>
                <span>{spanPwd}</span>
                <input type='password' value={password} className="loginInput" onChange={(e) => setPassword(e.target.value)} placeholder="Password"></input>
                <span>{spanCPwdm}</span>
                <input type='password' value={confirmPassword} className="loginInput" onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password"></input>
                <span>{spanEmail}</span>
                <input type='text' value={email} className="loginInput" onChange={(e) => setEmail(e.target.value)} placeholder="Email"></input>
                <span></span>
                <input type='text' value={contactNum} className="loginInput"  onChange={(e) => setContacNum(e.target.value)} placeholder="Contact Number"></input>
                <span></span>
                <input type='text' value={address} className="loginInput" onChange={(e) => setAddress(e.target.value)} placeholder="Address"></input>
                <button> Sign Up</button>
                <p> Already have an account? <NavLink to={"/login"}> Log In</NavLink></p>
            </form>
        </div>
    )
}

export default SignUp;