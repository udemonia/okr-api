const User = require('../Models/Users');
const ErrorResponse = require('../middleware/errors')

//* POST 
//* Route => POST/api/v1/authentication/registration
//* Public Access
exports.registerUser = async (req,res,next) => {
    //* de-structure req.body to grab name, email, password, role
    const { name, email, password, role } = req.body;

    //! Sanity Check!
    console.log({
        name,
        email,
        password
    })

    //* create a User in the Mongo table - password will be handled via mongoose model
    try {
        const user = await User.create({
            name: name,
            email: email,
            password: password,
            role: role
        })

        res.status(200).json({
            success: true
        })

        if (!user) {
            next(new ErrorResponse('User Insert Failed', 500))
        }
    } catch (error) {
        console.log(error)
    }
}