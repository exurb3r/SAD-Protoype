const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    nameOfexercise: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true   
    },
    reps: {
        type: Number
    },
    dayAssigned: {  
        type: String    
     },
    timeAssigned: {
        type: String   
    } 
});

const routineSchema = new Schema({
    routineName: {
        type: String,
        required: true,
    },
    exercises: [ exerciseSchema]
});

const routineHistorySchema = new Schema({
    routineName: {
        type: String,
        required: true,
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
},  { _id: false });

const userRoutineSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    routines: [ routineSchema],
    sharedRoutines: [ routineSchema],   // this is for routines that the user has shared with friends
    routineHistory: [ routineHistorySchema]   
});

module.exports = mongoose.model('UserRoutine', userRoutineSchema);