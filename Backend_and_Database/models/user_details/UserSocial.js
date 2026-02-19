const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSubSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    email: {
        type: Date,
        default: Date.now
    },
    description: {  
        type: String,
    }
});

const userSocialSchema = new Schema({
    email:{
        type: String,
        required: true
    }, 
    friends: [noteSubSchema]
});

module.exports = mongoose.model('UserSocial', userSocialSchema);