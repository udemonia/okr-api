const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../Models/Users');
const chalk = require('chalk')

exports.loginRequiredRoutes = async (req,res,next) => {
    
    //* Lets check for bearer tokens first -> this in the 'Bearer {{token}}' format
    //* we want to pull this out of the request header!
    let bearerAccessToken;

    const requestAuthHeader = req.headers.authorization

    //* fail fast -> no auth headers should return a failed call right away
    if (!requestAuthHeader) {
        return next(new ErrorResponse('Not Authorized', 404))
    }

    //* lets check to see if the Authorization header value starts with Bearer
    const includesBearer = requestAuthHeader.startsWith('Bearer')
    const requestCookiesToken = req.cookies.token

    if (requestAuthHeader && includesBearer) {
        bearerAccessToken = requestAuthHeader.split(' ')[1]
    }

    //* We won't check this in Dev Env but will introduce this with production
    // else if (requestCookiesToken) {
    //     bearerAccessToken = requestCookiesToken
    // }

    //* check that token exists - return next with error if undefined
    if (!bearerAccessToken) {
        return next(new ErrorResponse('Not Authorized', 404))
    }


    try {
        //* Now we need to validate the token:
        //? jwt.verify takes three arguments
        //* 1. the token string
        //* 2. the secret (in process.env.JWT_SECRET)
        //* 3. options - we're not passing any here
        const decodedJSONWebToken = jwt.verify(bearerAccessToken, process.env.JWT_SECRET)

        console.log(chalk.green.inverse.bold(JSON.stringify(decodedJSONWebToken, null, 2)))

        //* pull out the User.id and search for it in Mongo
        //* we'll store the User in the request object
        debugger
        req.user = await User.findById(decodedJSONWebToken.id)
        next()
    } catch (error) {
        console.log(chalk.red.bold(error))
        return next(new ErrorResponse('Not Authorized', 404));

    }
} 