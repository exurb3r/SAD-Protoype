const Notes = require('../models/user_models/Task');
const User = require('../models/user_models/AppUsers');
const bcrypt = require('bcrypt');
const { logMake, errorLog} = require('../middleware/logEvents');

const taskFetcher = async (req, res) => {
    try{
        const userId = req.user.id;

        const userFound = await User.findById(userId);
        if (!userFound) return res.status(404).json({message: "User not found"});

        let notes = await Notes.findOne({ email: userFound.email });

        if (!notes) {
            notes = await Notes.create({
                email: userFound.email,
                notes: []
            });
        }

        res.json(notes);

    } catch (err) {
        res.status(500).json({ message: err.message});
    }
}

const taskAdder = async (req, res) => {
    try{
        const {email, title, description} = req.body;
        if(!email || !title || !description) return res.status(400).json({message: "All credentials are required"})
        const notes = await Notes.findOneAndUpdate(
            {email},
            {
                $push:{
                    notes:{
                        title: title,
                        date: new Date(),
                        description: description
                    }
                }
            },
            { new: true} // to return this updated?
        );
        if (!notes) return res.status(404).json({'message': 'user does not exist'});

        res.status(200).json(notes);

    } catch (err){
        res.status(500).json({ message: err.message});
    }
}

const taskDeleter = async (req, res) => {
    try{
        const {email, noteId} = req.body;
        if(!email || !noteId) return res.status(400).json({message: "All credentials are required"})
        const notes = await Notes.findOneAndUpdate(
            { email },
            { $pull: {notes: {_id: noteId} } },
            { new: true} // to return this updated?
        );
        if (!notes) return res.status(404).json({'message': 'user does not exists'});

        res.status(200).json(notes);

    } catch (err){
        res.status(500).json({ message: err.message});
    }
}

const taskEditor = async (req, res) => {
    try{
        const { email, noteId, title, description } = req.body;
        if(!email || !noteId || !title || !description) return res.status(400).json({message: "All credentials are required"})
        const notes = await Notes.findOneAndUpdate(
            { email, "notes._id": noteId },
            {
                $set: {
                    "notes.$.title": title,
                    "notes.$.description": description,
                    "notes.$.date": new Date()
                }
            },
            { new: true }
        );
        if (!notes) return res.status(404).json({'message': 'user does not exists'});

        res.status(200).json(notes);

    } catch (err){
        res.status(500).json({ message: err.message});
    }
}
module.exports = { taskFetcher, taskAdder, taskDeleter, taskEditor };