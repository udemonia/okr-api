const express = require('express');
const router = express.Router();
const User = require('../Models/Users');
//? bring in the User Authentication middleware and hide our routes behind them
const { loginRequiredRoutes } = require('../middleware/bearerAuth')
const { 
    registerUser 
    , logUserIn
    , getCurrentLoggedInUser
} = require('../controller/authController')


router.route('/registration')
    .post(registerUser)

router.route('/login')
    .post(logUserIn)

//* pass the loginRequiredRoutes middleware to validate the user is logged in
router.route('/CurrentLoggedUser')
    .get(loginRequiredRoutes, getCurrentLoggedInUser)


module.exports = router;