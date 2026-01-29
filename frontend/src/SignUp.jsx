import React, { useState, useEffect} from 'react';

function SignUp(){
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contactNum, setContacNum] = useState('');
    const [address, setAddress] = useState('');

    async function register(event){
        event.preventDefault();

        if(firstname === '' || lastname === '' || username === '' || email === '' || password=== '' || contactNum === '' || address === ''){
            return console.log('Needs All Credentials to be filled');
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

    return(
        <div className='signUpPage'>
            <h1>Sign Up</h1>
            <form onSubmit={register} className='signUpForm'>
                <input type='text' value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="First Name"></input>
                
                <input type='text' value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Last Name"></input>
                
                <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"></input>
                
                <input type='text' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"></input>
                
                <input type='text' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password"></input>
                
                <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"></input>
                
                <input type='text' value={contactNum} onChange={(e) => setContacNum(e.target.value)} placeholder="Contact Number"></input>
                
                <input type='text' value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address"></input>
                <button> Sign Up</button>
            </form>

            <p> Already have an account? <span> Log in</span></p>

        </div>
    )
}

export default SignUp;