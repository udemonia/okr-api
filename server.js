const express = require('express');
const chalk = require('chalk');
const app = express();
const path = require('path')
const dotenv = require('dotenv');
dotenv.config({ path:'./config/.env'});
const morgan = require('morgan');
const bodyParser = require('body-parser');
const connectDb = require('./utils/db');
const fileUpload = require('express-fileupload');
const handleErrors = require('./middleware/errors')
const cookieParser = require('cookie-parser');
//! Security packages
const sanitize = require('express-mongo-sanitize'); // prevent operator injection attacks
const helmet = require('helmet'); // set security headers
const xssClean = require('xss-clean'); // prevent script injection
const expressRateLimit = require('express-rate-limit'); // prevent DOS and DDOS attacks by limiting the number of requests made
const hpp = require('hpp'); // prevents http param pollution attacks
const cors = require('cors'); // allow other origins to reach out API
//! Security packages

connectDb();

//?-----------------------------------------------
//                 Middleware
//?-----------------------------------------------

//? expose the public file for user avatars
app.use(express.static(path.join(__dirname, 'public')))

//? req.json({})
app.use(express.json())

//? add cookies as a request object
//* https://github.com/expressjs/cookie-parser#readme
app.use(cookieParser())

//? Console logging while working out of the development server
if (process.env.NODE_ENV === 'development-env') {
    app.use(morgan('dev'))
}

//! Security packages - - - - - - - - - - - - - - -
//* prevent NoSQL injection attacks with operators
app.use(sanitize());

//* Add headers to prevent well known attacks
app.use(helmet())

//* Prevent Cross-Scripting Attacks by appending data to <script> </script> tags
app.use(xssClean())

//* Rate Limiting to prevent DOS and DDOS attacks
const limiter = expressRateLimit({
    windowMs: 10 * 60 * 1000, //ten minutes
    max: 200
})
app.use(limiter)

//* prevent param pollution
app.use(hpp());

//* allow cross origin requests - we want our front end to access this api
app.use(cors());

//! Security packages - - - - - - - - - - - - - - -

//* File Upload
//? upload images to MongoDb
app.use(fileUpload())



//?-----------------------------------------------
//                     Routes
//?-----------------------------------------------


// //* bring in the routers
const objectives = require('./routes/objectives-routes')
const keyResults = require('./routes/keyResults')
const authentication = require('./routes/auth')

// //* mount our routers
app.use(`/api/v1/objectives`, objectives);
app.use(`/api/v1/keyresults`, keyResults);
app.use(`/api/v1/auth`, authentication);

// app.use(`/api/v1/courses`, courses);
// app.use('/api/v1/auth', auth)


//! Middleware ^ after the routes

app.use(handleErrors);

//* port
const port = process.env.PORT || 2002


const server = app.listen(port, () => {
    console.log(`Listening in ${chalk.blueBright.bold( process.env.NODE_ENV )} environment on port ${chalk.bold.blueBright( port )}`)
})

// handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(chalk.red.bold(` Error: Unhandled Rejection Warning ${err}`))
    server.close(() => process.exit(1)) // 1 = failure
})