const express = require('express');
const router = express.Router();
const User = require('../Models/Users');
const { registerUser } = require('../controller/authController')


router.route('/registration')
    .post(registerUser)


module.exports = router;