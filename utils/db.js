const mongoose = require('mongoose');
const chalk = require('chalk')

const connectDb = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }) // promise returned.
    console.log(`Connected to ${chalk.magenta.bold(conn.connection.host)}`)
}

module.exports = connectDb