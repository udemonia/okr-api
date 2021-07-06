# MongoDB

## Create a cluster

we can create one free cluster per project but can have multiple projects linked to an account. Upon setup, it typically takes about 1-3 minutes

Add a user

## keep the default settings, read + write

## network access

Add IP - just yours, or anyone

## mongoose

Abstraction library for object modeling in mongo

With NoSQL you don't do data validation, schemas, etc at the db layer, you're doing in the code layer

1. bring in mongoose

2. create a connection - returns a promise - .then or async/await

3. connect() takes in the uri from mongo db - connection/application
4. Create a env variable with the connection string

5. call the connection string, pass options object

6. see the default options we'd want to pass

``` js
const connectDb = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }) // promise returned.
}
```

## Updating the app.listen to handle connection issues

``` js
const server = app.listen(port, () => {
    console.log(`Listening in ${chalk.magenta.bold( process.env.NODE_ENV )} environment on port ${chalk.bold.blueBright( port )}`)
})

// handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(chalk.red.bold(` Error: Unhandled Rejection Warning ${err}`))
    server.close(() => process.exit(1)) // 1 = failure
})
```

## _id

mongo adds underscore id automatically, its a collection object we will need to convert to a string for type comparisons
