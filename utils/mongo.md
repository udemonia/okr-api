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

## Define a model

``` js
const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters']
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters']
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS'
      ]
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    },
    careers: {
      // Array of strings
      type: [String],
      required: true,
      enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other'
      ]
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10']
    },
    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.jpg'
    },
    housing: {
      type: Boolean,
      default: false
    },
    jobAssistance: {
      type: Boolean,
      default: false
    },
    jobGuarantee: {
      type: Boolean,
      default: false
    },
    acceptGi: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
module.exports = mongoose.model('Bootcamp', BootcampSchema);
```

## CRUD Operations with MongoDB

### CREATE

once you have a model created, you can begin some crud operations

model.create()

> key/values that are not in the mongoose schema will be skipped, not causing an error

``` js
// bring the mongoose model in
const Bootcamp = require('../models/Bootcamp')

// call methods on the object
Bootcamp.create(req.body) // assuming the data aligns with the schema defined in the body

// this will return a promise, we will handle with Async/Await or .then and .catch
exports.postBootcamp = async (req,res) => {
    const bootcamp = await Bootcamp.create(req.body)
    try {
        res.status(201).json({
            success: true,
            data: `${bootcamp}`
        })
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
}
```

## READ ALL

``` js
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find()
        res.status(200).json({
            success: true,
            data: bootcamps
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Bad Request"
        })
    }
}

```

## Read one

``` js
exports.putBootcamp = async (req,res,next) => {

    try {
        // findByIdAndUpdate takes in the ID and what we're trying to insert (req.body)
        // we can also pass an options object, new true, run our validation schema to true
        const updateBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        // HANDLE UNDEFINED - IF WE GET THE FORMAT OF ID RIGHT BUT ONE DOESN'T EXIST
        if (!updateBootcamp) {
            return res.status(404).json({
                success: false,
                message: 'Bootcamp not found'
            })
        }
        res.status(204).json({
            success: true,
            message: updateBootcamp
        })

    } catch (error) {
        res.status(400).res.json({
            success: false,
            message: error
        })
    }

}

```

## Update one

``` js
const updateBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
})
if (!updateBootcamp) {
    return res.status(404).json({
        success: false,
        message: 'Bootcamp not found'
    })
}
```

## Delete One

``` js

exports.deleteBootcamp = async(req,res) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

        if (!bootcamp) {
            return res.status(400).json({
                success: false,
                message: 'Bootcamp ID not found'
            })
        }
        res.status(204).json({
            success: true,
            message: `${req.body.id} Deleted`
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error
        })
    }
}
```
