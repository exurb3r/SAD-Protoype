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
})

const userProgressSchema = new Schema({
    email:{
        type: String,
        required: true
    }, 
    notes: [noteSubSchema]
});

module.exports = mongoose.model('UserProgress', userProgressSchema);