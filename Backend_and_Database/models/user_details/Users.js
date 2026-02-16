const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
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
    membershipStatus: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Users', userSchema);