const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'team member'],
      default: 'team member',
    },
    avatar: {
      type: String,
    },
    createdProjects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    assignedProjects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    assignedTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)
