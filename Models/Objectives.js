const mongoose = require('mongoose');
const slugify = require('slugify')
const chalk = require('chalk')


const ObjectiveSchema = new mongoose.Schema({
        name: {
          type: String,
          required: [true, 'Please add a name'],
          unique: true,
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
        percentComplete: {
          type: Number,
          default: 0
        },
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: false
        }
      },
      {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
      }
)

//? We need to get the percent complete - which should be an aggregate of all key results progress / count of key results
//* Calculate the Avg. progress of all key results in an objective and save it as this.percentComplete


// cascading delete - if we delete the objective - we should delete the 
ObjectiveSchema.pre('remove', async function(next) {
  console.log(`courses being removed from objective: ${this._id}`)
  await this.model('KeyResult').deleteMany({
    objective: this._id
  })
})

//? Lets Create a SLUG pre-save
ObjectiveSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {
      lower: true,
    })
    next()
  })


module.exports = mongoose.model('Objectives', ObjectiveSchema);