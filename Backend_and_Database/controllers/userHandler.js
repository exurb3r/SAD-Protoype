const User = require('../models/user_details/Users');
const bcrypt = require('bcrypt');

const userFetcher = async (req, res) => {
    try{
        const { email, password } = req.query;
        if (!email) return res.status(400).json({message: "Needs email and password"});
        
        const userFound = await User.findOne({email});
        if (!userFound) return res.status(404).json({'message': 'user does not exists'});
        res.json(userFound);
        logMake({email}, "Fetched Notes");

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
        const hashedPassword = await bcrypt.hash(password, 10);

        const addNewUser = await User.create({
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: hashedPassword,
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