const User = require('../Models/Users');
const ErrorResponse = require('../utils/errorResponse')

//* POST 
//* Route => POST/api/v1/authentication/registration
//* Public Access
exports.registerUser = async (req,res,next) => {
    //* de-structure req.body to grab name, email, password, role
    const { name, email, password, role } = req.body;

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
        const authToken = user.produceSignedWebToken()
        res.status(200).json({
            success: true,
            token: authToken
        })

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
    debugger

    //* 1. get email + password from req.body
    const {email, password} = req.body

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
    debugger
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
    console.log(cookieOptions)

    //* res.cookie takes in three arguments
    //* 1. the key 'token'
    //* 2. the JSON Web Token - authToken => user.produceSignedWebToken()
    //* 3. an Options object - expires and httpOnly in our case

    
    // console.log(res.cookie)
    res.status(statusCode).cookie('token', authToken, cookieOptions).json({
            success: true,
            token: authToken
        })
}