const mongoose = require('mongoose');
const chalk = require('chalk')
const slugify = require('slugify')


const KeyResultSchema = new mongoose.Schema({
        name: {
          type: String,
          required: [true, 'Please add a Key Result name'],
          trim: true,
          maxlength: [75, 'Name can not be more than 75 characters']
        },
        slug: String,
        description: {
          type: String,
          required: [true, 'Please add a description'],
          maxlength: [500, 'Description can not be more than 500 characters']
        },
        atRisk: {
          type: Boolean,
          default: false
        },
        objective: {
            type: mongoose.Schema.ObjectId,
            ref: 'Objectives',
            required: true
        },
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: false
        },
        progress: {
          type: Number,
          default: 0
        },
        currentValue: {
          type: Number,
          default: 0
        },
        targetValue: {
          type: Number,
          default: 0
        },
        tasks: [{
          name: String,
          completed: {
            type: Boolean,
            default: false
          }
        }]
      },
      {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
      }
)
//? Lets Create a SLUG pre-save
KeyResultSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {
    lower: true,
  })
  next()
})

//? We need to calculate % complete 'Progress' on the key Result dynamically based upon the current and target values
KeyResultSchema.pre('save', function(next) {
  this.progress = (this.currentValue / this.targetValue) * 100
  next()
})

//* not sure why this has to be on the key result and not the objective but....


//* Lets create a static method to calculate the average progress
// KeyResultSchema.statics.getAverageProgress = async (objectiveId) => {
//   console.log('Calculating Average Progress.....')
//   //? Create a Pipeline and handle the steps to the pipeline
//   //? Match the objective on this model with whatever is passed in
//   //? After Match
//   //? Group - group together the objective id and avg progress as an obj
//   const obj = await this.aggregate([
//     {
//       $match: { objective: objectiveId }
//     },
//     {
//       $group: {
//         _id: '$objective',
//         percentComplete: { $avg: '$progress'}
//       }
//     }
//   ])
//   console.log(obj)
// }

// //! We get the objective id at save, so at post save we can access it.
// KeyResultSchema.post('save', () => {
//   this.constructor.getAverageProgress(this.objective)
// })

// //! We want to do the same before we remove
// KeyResultSchema.pre('remove', () => {
//   this.constructor.getAverageProgress(this.objective)
// })


// lets create a static method on the Mongoose Course Schema to calculate average cost
KeyResultSchema.statics.getAverageProgress = async function(objectiveId) {

  //? Create an object with Objective ID and Avg Progress of each Key Result to insert into Objective
  //* Match all Key Results on Objective ID and Group on Obj ID and Avg. Progress
  const obj = await this.aggregate([
      {
          $match: { objective: objectiveId }
      },
      {
          $group: {
              _id: '$objective',
              percentComplete: { $avg: '$progress'}
          }
      }
  ])
  console.log(obj) //

  //* Save the Obj Into the Objective Database

  try {
      await this.model('Objectives').findByIdAndUpdate(objectiveId, {
          //* Round to two decimal places
          percentComplete: Math.round(obj[0].percentComplete)
      })
  } catch (err) {
      console.log(chalk.red.bold(err))
  }

}

//! Pre Removal of a Key Result, we need to recalculate the avg. progress by objective
KeyResultSchema.post('save', function() {
  this.constructor.getAverageProgress(this.objective)

})

//! Pre Removal of a Key Result, we need to recalculate the avg. progress by objective
KeyResultSchema.pre('remove', function() {
  this.constructor.getAverageProgress(this.objective)
})



KeyResultSchema.virtual('keyResults', {
  ref: 'objective',
  localField: '_id',
  foreignField: 'KeyResult',
  justOne: false
})

module.exports = mongoose.model('KeyResult', KeyResultSchema);