const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const distributionSchema = new Schema({
    workoutType: {
        type: String    //example: cardio, 
    },
    numberofWorkouts: {
        type: Number  //sets  specifically for arms, legs, core etc.
    },
    timeSpent: {
        type: Number  //in hours and this is specifically for Jogging and Threadmills
    }
});

const progressSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    hoursSpent: {
        type: Number
    },
    totalWorkouts: {
        type: Number
    },
    totalExpGained:{
        type: Number
    },
    distribution: [ distributionSchema ]
})

const userProgressSchema = new Schema({
    email:{
        type: String,
        required: true
    }, 
    progress: [progressSchema]
});

module.exports = mongoose.model('UserProgress', userProgressSchema);