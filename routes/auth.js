const express = require('express');
const router = express.Router();
const User = require('../Models/Users');
const { 
    registerUser 
    , logUserIn
} = require('../controller/authController')


router.route('/registration')
    .post(registerUser)

router.route('/login')
    .post(logUserIn)


module.exports = router;