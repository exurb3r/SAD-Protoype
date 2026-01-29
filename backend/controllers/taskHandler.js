    const Notes = require('../models/Task');
    const User = require('../models/Users');
    const bcrypt = require('bcrypt');
    const { logMake, errorLog} = require('../middleware/logEvents');

    const taskFetcher = async (req, res) => {
        try{
            const { email, password } = req.query;

            if (!email || !password) return res.status(400).json({message: "Needs username"});

            const userFound = await User.findOne({email});
            if (!userFound) return res.status(404).json({'message': 'user does not exists'});

            const match = await bcrypt.compare(password, userFound.password);
            if(!match) return res.status(400).json({message: "Password not match"});

            let notes = await Notes.findOne({email});
            if (!notes){
                notes = await Notes.create({
                    email: email,
                    notes: []
                });
            }

            res.json(notes);
            logMake({ email }, "Fetched Notes");

        } catch (err) {
            res.status(500).json({ message: err.message});
            errorLog(err.message);
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
            logMake({ email } , "Added Notes");
        
        } catch (err){
            res.status(500).json({ message: err.message});
            errorLog(err.message);
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
            logMake({email}, "Deleted Notes");
        
        } catch (err){
            res.status(500).json({ message: err.message});
            errorLog(err.message);
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
            logMake({ email }, "Edited Notes");

        } catch (err){
            res.status(500).json({ message: err.message});
            errorLog(err.message);
        }
    }
    module.exports = { taskFetcher, taskAdder, taskDeleter, taskEditor };