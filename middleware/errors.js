const chalk = require('chalk')
const errorResponse = require('../utils/errorResponse')

const handleErrors = (err,req,res,next) => {
    let error = {... err}
    error.message = error.message
    console.log(`this is the error object ${err}`)
    console.log(chalk.red.bold.italic(err))
    // console.log(chalk.red.bold.italic(err.stack)) 
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message
    })
}

module.exports = handleErrors;