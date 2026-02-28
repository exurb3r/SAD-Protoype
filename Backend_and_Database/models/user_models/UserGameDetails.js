const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const achievementsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {  
        type: String,
    },
    dateAchieved: {
        type: Date,
        default: Date.now
    },
    exp_gained: {
        type: Number
    }
});

const acceptedInvitesSchema = new Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    friendMessage: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    time: {
        type: String,
    }
});

const UserGameDetailsSchema = new Schema({
    email:{
        type: String,
        required: true
    }, 
    achievements: [achievementsSchema],
    level: {
        type: Number
    },
    exp_points: {
        type: Number
    },
    highestStreak: {
        type: Number
    },
    currentStreak: {
        type: Number
    },
    acceptedInvites: [ acceptedInvitesSchema ]
});

module.exports = mongoose.model('UserGameDetails', UserGameDetailsSchema);