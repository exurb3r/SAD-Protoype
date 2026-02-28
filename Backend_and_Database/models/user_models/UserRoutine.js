const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    nameOfexercise: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true   // if arms, core, shoulders, legs, stamina etc.
    },
    reps: {
        type: Number
    },
    dayAssigned: {  
        type: String    // example: Monday, Tuesday etc. this is optional since some users might want to assign exercises without a specific day in mind
     },
    timeAssigned: {
        type: String    // example: Morning, Afternoon, Evening this is optional since some users might want to assign exercises without a specific time in mind
    } 

});
const routineSchema = new Schema({
    routineName: {
        type: String,
        required: true
    },
    exercises: [ exerciseSchema]
});

const routineHistorySchema = new Schema({
    routineName: {
        type: String,
        required: true
    },
    exercises: [ exerciseSchema],
    dateCompleted: {
        type: Date,
        default: Date.now
    },
    duration: {
        type: Number 
    },
    expGained: {
        type: Number
    } // this may only contain atmost 10 entries
});

const userRoutineSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    routines: [ routineSchema],
    sharedRoutines: [ routineSchema],   // this is for routines that the user has shared with friends
    routineHistory: [ routineHistorySchema]   
});

module.exports = mongoose.model('UserRoutine', userRoutineSchema);