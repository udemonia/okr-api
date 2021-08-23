const User = require('../Models/Users');
const ErrorResponse = require('../utils/errorResponse')
const fileUpload = require('express-fileupload')
const path = require('path') // for the file extension on image upload

//todo noticing a cookie token even if we pass incorrect values....

//* POST 
//* Route => POST/api/v1/authentication/registration
//* Public Access
exports.registerUser = async (req,res,next) => {
    //* de-structure req.body to grab name, email, password, role
    const { name, email, password, role } = req.body;
    console.log(req.body)

    //* create a User in the Mongo table - 
    //* password will be handled via mongoose pre-save function,
    //* using a secret and salt to hash the password in the database
    try {
        const user = await User.create({
            name: name,
            email: email,
            password: password,
            role: role
        })
        //* Cookies that have been signed
        tokenResponseWithCookie(user, 200, res)

        if (!user) {
            next(new ErrorResponse('User Insert Failed', 500))
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false
        })
    }
}

exports.logUserIn = async (req,res,next) => {

    //* 1. get email + password from req.body
    const {email, password} = req.body

    console.log(req.body)

    //* 2. quick validation on email + password
    if (!password || !email) {
        return next(new ErrorResponse(`Invalid Login`, 400))    
    }

    //* 3. Check that a user exists.....
    //*    we're not selecting password by default on the User object, 
    //*    we'll need to pass select +password
    const user = await User.findOne({
        email: email
    }).select('+password')

    //* 4. Check that that the user exists
    if (!user) {
        return next(
            new ErrorResponse(`Invalid Login`, 401)
            )  //! same Error as validated user !
    }

    //* 5. take the plain text password that's being passed in & match it to the hashed password in the database.
    const validatedUser = await user.validateLogInPassword(req.body.password) // should be true or false

    if (!validatedUser) {
        return next(
            new ErrorResponse(`Invalid Login`, 401)
            )  //! same Error as no user !
    }

    //* Cookies that have been signed
    tokenResponseWithCookie(user, 200, res)

}

//* Function to set cookies on the request object
const tokenResponseWithCookie = (user, statusCode, res) => {
    //* create a token
    const authToken = user.produceSignedWebToken()

    //* Create a cookie options
    //? It will be up to the front-end on how they handle the cookie
    //* Need to understand why we're using this math to get to 30 days
    const cookieOptions = { 
        expires: new Date(Date.now() + process.env.JWT_COOKIE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    
    //* cookie's secure option as true only if we're in production
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true
    }

    console.log(cookieOptions)

    //* res.cookie takes in three arguments
    //* 1. the key 'token'
    //* 2. the JSON Web Token - authToken => user.produceSignedWebToken()
    //* 3. an Options object - expires and httpOnly in our case
    res.status(statusCode).cookie('token', authToken, cookieOptions).json({
            success: true,
            token: authToken
        })
}

exports.getCurrentLoggedInUser = async (req,res,next) => {
    
    //* we're getting and setting the current logged in User
    //* via the Bearer Authentication loginRequiredRoutes middleware 
    //* upon validating the user, we're adding the object to the 
    //* req -> req.user

    try {
        const userId = req.user.id;

        console.log(userId);

        if (!userId) {
            next(new ErrorResponse('Auth Headers Are not Set', 401))
        }

        //* if we have auth headers, we should be able to pull back the user info
        const user = await User.findById(userId)
        
        console.log(JSON.stringify(user, null, 2))
    
        res.status(200).json({
            success: true,
            data: user
        })
        
    } catch (error) {
        next(new ErrorResponse('Get User Failed', 500))
    }

}

exports.logout = async (req,res,next) => {
    //* we want to clear the cookies/token
    res.cookie('token', 'none', {
        expires: new Date(Date.now + 5 * 1000),
        httpOnly: true
    })


    //* Respond with an empty object
    res.status(200).json({
        success: true,
        data: {}
    })
}

// todo add avatar upload