import React, { useState, useEffect} from 'react';

function NoteApp(){
    const username = "Roven";

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    function handleTitleChange(event){
        setTitle(c => c = event.target.value);
    }

    function handleDescriptionChange(event){
        setDescription(c => c = event.target.value);
    }

    function addNotes(event){
        event.preventDefault();

        if(title === '' || description === ''){
            return console.log('Needs title and description');
        }

        const notes = {
            username,
            title,
            description
        };
        console.log(notes)

       async function sendNotes(){
            try{
                const response = await fetch('http://localhost:3500/noteHandler/post',{
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(notes)
                });

                if(!response.ok){
                    throw new Error('Failed to add note');
                }

                const updates = await response.json();
                console.log(updates);
                setTitle('');
                setDescription('');

            } catch (err){
                console.error(err);
            }
        }
        sendNotes();
    }






    return(
    <div>
        <div>
            <h1>Notes Application</h1>
        </div>
        <div>
            <form>
                <input type='text' placeholder='Your Title' value={title} onChange={(e) => handleTitleChange(e)}></input>
                <br/>
                <textarea placeholder='Description' value={description} onChange={(e) => handleDescriptionChange(e)}></textarea>
                <br/>
                <button onClick={(e) => addNotes(e)}> Add Notes</button>
            </form>
        </div>       
    </div>
    );
}
export default NoteApp;