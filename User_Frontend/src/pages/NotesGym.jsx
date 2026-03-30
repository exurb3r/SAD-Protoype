import React, { useState, useEffect } from 'react';
import '../assets/Notes.css';

function NotesGym() {
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

    async function getNote() {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:3500/users/fitnessnotes", { headers: authHeader });
            if (!response.ok) throw new Error('Failed to fetch notes');
            const data = await response.json();
            setNoteList(data.notes || []);
        } catch (err) {
            console.error(err);
            setNoteList([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { getNote(); }, []);

    async function addNotes(event) {
        event.preventDefault();
        if (!title || !description) return;
        try {
            const response = await fetch("http://localhost:3500/users/fitnessnotes", {
                method: "POST",
                headers: authHeader,
                body: JSON.stringify({ title, description })
            });
            if (!response.ok) throw new Error('Failed to add note');
            const updates = await response.json();
            setTitle('');
            setDescription('');
            setNoteList(updates.notes);
        } catch (err) { console.error(err); }
    }

    async function deleteNote(noteId) {
        try {
            const response = await fetch("http://localhost:3500/users/fitnessnotes", {
                method: "DELETE",
                headers: authHeader,
                body: JSON.stringify({ noteId })
            });
            if (!response.ok) throw new Error('Failed to delete note');
            const updates = await response.json();
            setNoteList(updates.notes);
        } catch (err) { console.error(err); }
    }

    async function updateNote(noteId) {
        try {
            const response = await fetch("http://localhost:3500/users/fitnessnotes", {
                method: "PATCH",
                headers: authHeader,
                body: JSON.stringify({ noteId, title: editTitle, description: editDescription })
            });
            if (!response.ok) throw new Error('Failed to update note');
            const updates = await response.json();
            setNoteList(updates.notes);
            setEditingId(null);
        } catch (err) { console.error(err); }
    }

    return (
        <div className="notes-page">

            <div className="notes-header">
                <div>
                    <h1 className="notes-title">Fitness List</h1>
                    <p className="notes-sub">{noteList.length} {noteList.length === 1 ? 'note' : 'notes'}</p>
                </div>
            </div>

            <div className="notes-layout">

                {/* Add note panel */}
                <div className="notes-add-panel">
                    <p className="notes-panel-label">New Note</p>
                    <form onSubmit={addNotes} className="notes-form">
                        <input
                            className="notes-input"
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        <textarea
                            className="notes-textarea"
                            placeholder="Write your note..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={5}
                        />
                        <button
                            type="submit"
                            className={`notes-btn-primary ${(!title || !description) ? 'disabled' : ''}`}
                            disabled={!title || !description}
                        >
                            + Add Note
                        </button>
                    </form>
                </div>

                {/* Notes grid */}
                <div className="notes-grid-area">
                    {loading ? (
                        <p className="notes-loading">Loading notes...</p>
                    ) : noteList.length === 0 ? (
                        <div className="notes-empty">
                            <p>No notes yet. Add your first one.</p>
                        </div>
                    ) : (
                        <div className="notes-grid">
                            {noteList.map(note => (
                                <div key={note._id} className="note-card">
                                    {editingId === note._id ? (
                                        <div className="note-edit-mode">
                                            <input
                                                className="notes-input"
                                                value={editTitle}
                                                onChange={e => setEditTitle(e.target.value)}
                                            />
                                            <textarea
                                                className="notes-textarea"
                                                value={editDescription}
                                                onChange={e => setEditDescription(e.target.value)}
                                                rows={4}
                                            />
                                            <div className="note-actions">
                                                <button className="notes-btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                                                <button className="notes-btn-ghost confirm" onClick={() => updateNote(note._id)}>Save</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="note-view-mode">
                                            <div className="note-card-top">
                                                <h2 className="note-card-title">{note.title}</h2>
                                                <span className="note-date">
                                                    {new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="note-card-body">{note.description}</p>
                                            <div className="note-actions">
                                                <button className="notes-btn-ghost" onClick={() => {
                                                    setEditingId(note._id);
                                                    setEditTitle(note.title);
                                                    setEditDescription(note.description);
                                                }}>Edit</button>
                                                <button className="notes-btn-ghost danger" onClick={() => deleteNote(note._id)}>Delete</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default NotesGym;
