import React, { useState, useEffect} from 'react';

function SignIn(){
    const email = localStorage.getItem('email');
    const sendPassword = localStorage.getItem('sendPassword');

    const [inputEmail, setInputEmail ] = useState('');
    const [inputPassword, setInputPassword] = useState('');
 
    async function getUser(event){
        event.preventDefault();
        try{
            setLoading(true);
            const response = await fetch(`http://localhost:3500/getUser/get?email=${inputEmail}&password=${inputPassword}`);

            if(!response.ok){
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            setNoteList(data.notes || []) ;

        } catch (err){
            console.error(err);
        } finally {
            setLoading(false);
        }
    
    }


    return(
        <div>
            <form onSubmit={ getUser } className='signUpForm'>
                <input type='text' value={ inputEmail } onChange={(e) => setInputEmail(e.target.value)} placeholder="Email"></input>
                <input type='password' value={ inputPassword } onChange={(e) => setInputPassword(e.target.value)} placeholder="Password"></input>    
                <button> Sign In</button>
            </form>

        </div>
    );
}
export default SignIn;