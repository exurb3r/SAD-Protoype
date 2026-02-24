const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSubSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {  
        type: String,
    }
});

const noteSchema = new Schema({
    email:{
        type: String,
        required: true
    }, 
    notifications: [noteSubSchema]
});

module.exports = mongoose.model('UserNotifications', noteSchema);