require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = 3500;
const connectDB = require('./config/dbNotes');
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use('/admin', require('./routes/user_routes/taskRouter'));
app.use('/user', require('./routes/user_routes/userRouter'));
app.use('/auth', require('./routes/auth_routes/authRouter'));

app.get('/home', (req, res) =>{
    res.send("Server home");
});

mongoose.connection.once('open', () => {
    console.log('Connected to Database');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    });
});