const express = require('express');
const router = express.Router();
const User = require('../Models/Users');
//? bring in the User Authentication middleware and hide our routes behind them
const { loginRequiredRoutes } = require('../middleware/bearerAuth')
const { 
    registerUser 
    , logUserIn
    , getCurrentLoggedInUser
    , logout
    , uploadAvatarPhoto
    , uploadPhoto
} = require('../controller/authController')

//* route for adding Avatar Photos to the logged in user's user object
// todo add a route for file upload
// router.route('/me/avatar').put(loginRequiredRoutes, uploadPhoto)

router.route('/registration')
    .post(registerUser)

router.route('/login')
    .post(logUserIn)

router.route('/logout')
    .get(loginRequiredRoutes, logout)

// //* pass the loginRequiredRoutes middleware to validate the user is logged in
router.route('/CurrentLoggedUser')
    .get(loginRequiredRoutes, getCurrentLoggedInUser)


module.exports = router;