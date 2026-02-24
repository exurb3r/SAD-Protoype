const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dayRoutineSchema = new Schema({
    exercise: {
        type: String,
        required: true
    },
    repitition: {
        type: Number,
        required: true
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

module.exports = mongoose.model('UserRoutine', userRoutineSchema);