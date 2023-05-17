const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const User = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        lowercase: true,
        unique: true,
        // required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,
    },

    firstName: {
        type: String,
        default: ''
    },
    
    lastName: {
                type: String,
                default: ''
    },
        
    displayName: {
        type: String,
        default: '',
    },

    password: {
        type: String,
        trim: true,
        minlength:6,
        maxlength: 60,
    },

    token: {
        type: String,
        // unique: true
    }
});

User.plugin(findOrCreate);
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
