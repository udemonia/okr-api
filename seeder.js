
//* A Mongo Database Seeder for Objectives and Key Results
//* The seeder will connect to the Mongo Database through via 
//* The connection url provided in config/.env

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({ path:'./config/.env'})
const chalk = require('chalk');
const Objective = require('./models/Objectives');
const connectToDb = require('./utils/db')
const KeyResult = require('./models/KeyResults')



//! fail fast - if we get a wrong command, 
//! quite before attempting to connect to the db
if (process.argv[2] != '-import' && process.argv[2] != '-delete') {
    console.log(chalk.red.inverse(`  This file needs either an -import or -delete argument  `))
    process.exit(1)
}

//* Read in json file - Parse
const objectiveData = JSON.parse(fs.readFileSync(`${__dirname}/_data/objectives.json`, 'utf-8'))
const keyResultData = JSON.parse(fs.readFileSync(`${__dirname}/_data/keyResults.json`, 'utf-8'))

//* Handle imported JSON data db insertion
const importData = async function() {
    try {
        await Objective.create(objectiveData)
        await KeyResult.create(keyResultData)
        console.log(chalk.green.inverse(`  Data Imported  `))
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

//* Delete All of the Data in the database ! 😱
const deleteAllData = async () => {
    try {
        // delete many without options removes all
        await Objective.deleteMany()
        await KeyResult.deleteMany()
        console.log(chalk.red.inverse(` Deleted All Data  `))
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

//* connect to the DB
connectToDb()
    .then(()=> {
        if (process.argv[2] === '-delete') {
            deleteAllData()
        } else if (process.argv[2] === '-import') {
            importData()
        }
    })
    .catch(err => console.log(err))




