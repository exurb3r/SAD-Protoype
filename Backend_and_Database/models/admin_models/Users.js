const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const membershipStatusSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    startDate: {
        type: Date
    },
    expiryDate: {
        type: Date
    },
    remainingDays: {
        type: Number
    }
},{ _id: false });

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contactNum: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    membershipStatus: [ membershipStatusSchema ],
    assignedTrainer: {
        type: String,
    },
    gymId: {    
        type: String,
        required: true,
        unique: true
    },
    rfid: {
        type: String,
        unique: true
    } //for those who have RFID cards, optional field, for RFID login
})

module.exports = mongoose.model('Users', userSchema);