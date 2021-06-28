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

//? Lets Create a SLUG pre-save
ObjectiveSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {
      lower: true,
    })
    next()
  })

// We are going to need virtuals
// how the heck to we calculate percentages

module.exports = mongoose.model('Objectives', ObjectiveSchema);