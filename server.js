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

connectDb();

//?-----------------------------------------------
//              Middleware
//?-----------------------------------------------

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())

if (process.env.NODE_ENV === 'development-env') {
    app.use(morgan('dev'))
}

app.use(fileUpload())

// //* bring in the routers
const objectives = require('./routes/objectives-routes')
const keyResults = require('./routes/keyResults')

// //* mount our routers
app.use(`/api/v1/objectives`, objectives);
app.use(`/api/v1/keyresults`, keyResults);
// app.use(`/api/v1/courses`, courses);
// app.use('/api/v1/auth', auth)


//! Middleware ^ after the routes

// app.use(handleErrors);

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