const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dayRoutineSchema = new Schema({
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

const userRoutineSchema = new Schema({
    email:{
        type: String,
        required: true
    }, 
    monday: [dayRoutineSchema],
    tuesday: [dayRoutineSchema],
    wednesday: [dayRoutineSchema],
    thursday: [dayRoutineSchema],
    friday: [dayRoutineSchema],
    saturday: [dayRoutineSchema],
    sunday: [dayRoutineSchema],
});

module.exports = mongoose.model('userRoutine', userRoutineSchema);