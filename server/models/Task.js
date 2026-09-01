const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },

    status: {
      type: String,
      enum: ['Todo', 'In Progress', 'Completed'],
      default: 'Todo'
    },

    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },

    dueDate: {
      type: Date
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Task', taskSchema)