const User = require('../models/user_details/Users');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({message: "Email and Password are required"});
        
        const userFound = await User.findOne({email});
        if (!userFound) return res.status(401).json({'message': 'User does not exists'});

        const match = await bcrypt.compare(password, userFound.password);
        if (!match) return res.status(401).json({'message': 'Invalid Password'});

        const token = jwt.sign(
            { id: userFound._id, username: userFound.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            token,
            user: {
                id: userFound._id,
                username: userFound.username,
                email: userFound.email
            } 
        }
        );

    } catch (err) {
        res.status(500).json({ message: err.message});
    }
}

const signup = async(req, res) => {
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
            address: address,
            membershipStatus: "basic"
        })

        res.status(200).json(addNewUser);


    } catch (err) {
        res.status(500).json({ message: err.message});
        console.error(err);
    }
}

module.exports = {login, signup};