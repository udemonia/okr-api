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

// todo how to handle no key results

//* lets create a static method on the Mongoose Course Schema to calculate average cost
KeyResultSchema.statics.getAverageProgress = async function(objectiveId) {
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
  try {
      await this.model('Objectives').findByIdAndUpdate(objectiveId, {
          percentComplete: Math.round(obj[0].percentComplete)
      })
      console.log(`Objective Percent Complete: ${obj[0].percentComplete}`)
  } catch (err) {
      console.log(chalk.red.bold(err))
  }

}
KeyResultSchema.post('save', function() {
  this.constructor.getAverageProgress(this.objective)

})

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