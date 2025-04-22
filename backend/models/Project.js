const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Project', ProjectSchema)
