import React, { useState, useEffect } from 'react';
import '../assets/Notes.css';

function NotesGym(){

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [noteList, setNoteList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const token = localStorage.getItem("token");

    const authHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

    async function getNote(){
        try{
            setLoading(true);

            const response = await fetch(`http://localhost:3500/user/get`, {
                headers: authHeader
            });

            if(!response.ok) throw new Error('Failed to fetch notes');

            const data = await response.json();
            setNoteList(data.notes || []);

        } catch (err){
            console.error(err);
            setNoteList([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getNote();
    }, []);

    async function addNotes(event){
        event.preventDefault();

        if(!title || !description) return;

        try{
            const response = await fetch(`http://localhost:3500/user/add`, {
                method: 'POST',
                headers: authHeader,
                body: JSON.stringify({ title, description })
            });

            if(!response.ok) throw new Error('Failed to add note');

            const updates = await response.json();
            setTitle('');
            setDescription('');
            setNoteList(updates.notes);

        } catch (err){
            console.error(err);
        }
    }

    async function deleteNote(noteId){
        try{
            const response = await fetch(`http://localhost:3500/user/delete`,{
                method: 'POST',
                headers: authHeader,
                body: JSON.stringify({ noteId })
            });

            if(!response.ok) throw new Error('Failed to delete note');

            const updates = await response.json();
            setNoteList(updates.notes);

        } catch (err){
            console.error(err);
        }
    }

    async function updateNote(noteId){
        try{
            const response = await fetch(`http://localhost:3500/user/edit`, {
                method: 'POST',
                headers: authHeader,
                body: JSON.stringify({
                    noteId,
                    title: editTitle,
                    description: editDescription
                })
            });

            if(!response.ok) throw new Error('Failed to update note');

            const updates = await response.json();
            setNoteList(updates.notes);
            setEditingId(null);

        } catch (err){
            console.error(err);
        }
    }

    return(
        <div className='noteAPP'>
            <h1 className='noteApp-title'>Task Handler</h1>            

            <div className='note-section'>

                {loading ? (<p>Loading notes...</p>) : (
                <ol>

                    {/* ADD FORM */}
                    <li className='note-container' id='add-section'>
                        <form onSubmit={addNotes}>
                            <h2>
                                <input
                                    type='text'
                                    placeholder='Your Title'
                                    value={title}
                                    onChange={(e)=>setTitle(e.target.value)}
                                />
                            </h2>

                            <textarea
                                placeholder='Description'
                                value={description}
                                onChange={(e)=>setDescription(e.target.value)}
                            />

                            <button type='submit'>Add Notes</button>
                        </form>
                    </li>

                    {/* NOTES LIST */}
                    {noteList.map(note => (
                        <li key={note._id} className='note-container'>

                        {editingId === note._id ? (
                            <div className="edit-notes">
                                <h2>
                                    <input
                                        value={editTitle}
                                        onChange={(e)=>setEditTitle(e.target.value)}
                                    />
                                </h2>

                                <textarea
                                    value={editDescription}
                                    onChange={(e)=>setEditDescription(e.target.value)}
                                />

                                <button onClick={()=>setEditingId(null)}>Cancel</button>
                                <button onClick={()=>updateNote(note._id)}>Confirm</button>
                            </div>

                        ) : (
                            <div className="show-notes">
                                <p className='date-tag'>
                                    {new Date(note.date).toLocaleString()}
                                </p>

                                <h2>{note.title}</h2>
                                <p className='note-description'>{note.description}</p>

                                <button onClick={()=>{
                                    setEditingId(note._id);
                                    setEditTitle(note.title);
                                    setEditDescription(note.description);
                                }}>
                                    Edit
                                </button>

                                <button onClick={()=>deleteNote(note._id)}>
                                    Delete
                                </button>
                            </div>
                        )}
                        </li>
                    ))}

                </ol>
                )}
            </div>       
        </div>
    );
}

export default NotesGym;
