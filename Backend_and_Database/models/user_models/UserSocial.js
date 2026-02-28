const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendSubSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: Date,
        default: Date.now
    },
});

const invitationSchema = new Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    friendMessage: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    time: {
        type: String,
    }
});

const userSocialSchema = new Schema({
    email:{
        type: String,
        required: true
    }, 
    friends: [friendSubSchema],
    friendRequests: [friendSubSchema],
    trainerAssigned: {
        type: String
    },
    invitationsSent: [invitationSchema]

});

module.exports = mongoose.model('UserSocial', userSocialSchema);