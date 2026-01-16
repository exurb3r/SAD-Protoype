function SignUp(){

    async function register(event){
        event.preventDefault();

        if(firstname === '' || lastname === '' || username === '' || email === '' || password=== '' || contactNum === '' || address === ''){
            return console.log('Needs title and description');
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

        } catch (err){
            console.error(err);
        }
    }

    return(
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={register}>
                <input type='text' name="firstname" placeholder="firstname"></input>
                <input type='text' name="lastname" placeholder="lastname"></input>
                <input type='text' name="username" placeholder="username"></input>
                <input type='text' name="password" placeholder="password"></input>
                <input type='text' name="email" placeholder="email"></input>
                <input type='text' name="contactNum" placeholder="contactNum"></input>
                <input type='text' name="address" placeholder="adress"></input>
                <button> Sign Up</button>
            </form>

        </div>
    )
}

export default SignUp;