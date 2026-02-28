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
});

const appUserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
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
    membershipStatus: [ membershipStatusSchema ],
    role: {
        type: Number,
        required: true,
        default: 420
    },
    joinDate: {
         type: Date,
         default: Date.now 
    }
})

module.exports = mongoose.model('AppUsers', appUserSchema);