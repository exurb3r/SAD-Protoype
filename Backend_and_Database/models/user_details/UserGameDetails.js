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
    exp_gained: {
        type: Number
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
    highestGymStreak: {
        type: Number
    },
    currentGymStreak: {
        type: Number
    }
});

module.exports = mongoose.model('UserGameDetails', UserGameDetailsSchema);