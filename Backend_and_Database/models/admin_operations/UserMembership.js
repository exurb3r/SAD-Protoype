const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userMembershipSchema = new Schema({
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
    contactNum: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    membershipStatus: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('UserMembership', userMembershipSchema);