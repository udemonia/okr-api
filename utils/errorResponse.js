class ErrorResponse extends Error {
    constructor(message, statusCode) {
        //? we extend the Errors class and make our own custom stuff :)
        //? call the constructor of the class you're extending
        super(message)
        this.statusCode = statusCode
    }
}

module.exports = ErrorResponse;