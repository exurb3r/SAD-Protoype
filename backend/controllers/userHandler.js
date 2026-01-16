const User = require('../models/Users');

const userFetcher = async (req, res) => {
    try{
        const { username } = req.query;

        if (!username) return res.status(400).json({message: "Needs username"});
        
        const userFound = await User.findOne({username});
        if (!userFound) return res.status(404).json({'message': 'user does not exists'});
        res.json(userFound);
        logMake({username}, "Fetched Notes");

    } catch (err) {
        res.status(500).json({ message: err.mesage});
        errorLog(err.message);
    }
}

const addUser = async(req, res) => {
    try{
        const {firstname, lastname, username, email, password, contactNum, address} = req.body;    
        if(!firstname ||!lastname ||!username ||!email || !password || !contactNum || !address) return res.status(400).json({message: "All credentials are required"});
        const newUser = await User.findOne({email});

        if(newUser) return res.status(400).json({message: "Email is already in use"});
        const addNewUser = await User.create({
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: password,
            contactNum: contactNum,
            address: address
        })

        res.status(200).json(addNewUser);


    } catch (err) {
        res.status(500).json({ message: err.message});
        console.error(err);
    }
}

module.exports = {addUser, userFetcher};