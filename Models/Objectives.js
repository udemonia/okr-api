const mongoose = require('mongoose');
const slugify = require('slugify')
const chalk = require('chalk')

// todo - add virtual key results, name and is completed


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

// reverse populate on the objective schema
// we're pulling in a virtual key Results array on the objective object
ObjectiveSchema.virtual('keyResults', {
  ref: 'KeyResults',
  localField: '_id',
  foreignField: 'objective',
  justOne: false
})

// We are going to need virtuals
// how the heck to we calculate percentages

module.exports = mongoose.model('Objectives', ObjectiveSchema);