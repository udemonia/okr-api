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

// We are going to need virtuals
// how the heck to we calculate percentages

KeyResultSchema.virtual('keyResults', {
  ref: 'objective',
  localField: '_id',
  foreignField: 'KeyResult',
  justOne: false
})

module.exports = mongoose.model('KeyResult', KeyResultSchema);