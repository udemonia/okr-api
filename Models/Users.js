const chalk = require('chalk')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please add a name']
    },
    email: {
        type: String,
        required: [true, 'Emails are required'],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 7,
        select: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

//* Encrypt the password using bcrypt
//* We need to handle this on pre-save via an async function so we're never actually storing passwords
UserSchema.pre('save', async function() {
    //* in order to encrypt we need a salt
    //* the higher the rounds the more secure but also taxing on system
    const salt = await bcrypt.genSalt(10)

    //* hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt)
})

//* JSON Web Token - pass our random JWT + Expiration from .env
//* we want to hide protected routes behind JSON web tokens
//* we have access to the user._id because we're calling this on the user object.
UserSchema.methods.produceSignedWebToken = function() {
    return jwt.sign({
        id: this._id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

//* Sign and respond w/ JSON web token and 

//! User -> Password -> select = false - should make it so we don't show the password.

module.exports = mongoose.model('User', UserSchema);