const mongoose = require('mongoose')
const databaseName = 'test'
const Objective = require('../../Models/Objectives')
const User = require('../../Models/Users')

//* Before all, we want to connect to a database

beforeAll(async () => {
  const url = process.env.OBJECTIVE_INT_TEST
  await mongoose.connect(url, { useNewUrlParser: true })
})

describe()




//* Nuclear TearDown
// async function removeAllCollections () {
//   const collections = Object.keys(mongoose.connection.collections)
//   for (const collectionName of collections) {
//     const collection = mongoose.connection.collections[collectionName]
//     await collection.deleteMany()
//   }
// }

// afterEach(async () => {
//   await removeAllCollections()
// })