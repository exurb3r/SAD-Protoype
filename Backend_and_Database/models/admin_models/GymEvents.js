const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSubSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    time: {
        type: String,
        required: true
    }
})

const gymEventsSchema = new Schema({
    event: [ eventSubSchema ]
})

module.exports = mongoose.model('GymEvents', gymEventsSchema);