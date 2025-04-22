const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const mongoose = require('mongoose')

// Load models
const Task = require('../models/Task')
const Project = require('../models/Project')
const User = require('../models/User')

// Auth middleware
const authMiddleware = require('../middleware/auth')

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post(
  '/',
  authMiddleware,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('project', 'Project ID is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    try {
      const {
        title,
        description,
        status,
        priority,
        project,
        assignedTo,
        deadline,
      } = req.body

      // Verify project exists
      const projectExists = await Project.findById(project)
      if (!projectExists) {
        return res
          .status(404)
          .json({ success: false, message: 'Project not found' })
      }

      // Check if user is authorized to create tasks in this project (owner or team member)
      if (
        projectExists.owner.toString() !== req.user.id &&
        !projectExists.team.some((member) => member.toString() === req.user.id)
      ) {
        return res
          .status(403)
          .json({
            success: false,
            message: 'Not authorized to create tasks in this project',
          })
      }

      // If task is assigned to someone, verify that user is part of the project
      if (
        assignedTo &&
        assignedTo !== projectExists.owner.toString() &&
        !projectExists.team.some((member) => member.toString() === assignedTo)
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message: 'Assigned user must be a member of the project',
          })
      }

      // Create new task
      const newTask = new Task({
        title,
        description,
        status: status || 'To Do',
        priority: priority || 'Medium',
        project,
        assignedTo: assignedTo || null,
        createdBy: req.user.id,
        deadline: deadline ? new Date(deadline) : null,
      })

      // Save task
      const task = await newTask.save()

      // Add task to project
      projectExists.tasks.push(task._id)
      await projectExists.save()

      // If task is assigned to someone, update their assignedTasks
      if (assignedTo) {
        await User.findByIdAndUpdate(
          assignedTo,
          { $push: { assignedTasks: task._id } },
          { new: true }
        )
      }

      res.json({
        success: true,
        data: task,
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ success: false, message: 'Server Error' })
    }
  }
)

// @route   GET /api/tasks
// @desc    Get all tasks for a user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { projectId, status, priority } = req.query

    // Build filter
    const filter = {}

    // Filter by project if specified
    if (projectId) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid project ID' })
      }
      filter.project = projectId
    } else {
      // If no project specified, find all tasks from projects where user is owner or team member
      const projects = await Project.find({
        $or: [{ owner: req.user.id }, { team: req.user.id }],
      }).select('_id')

      filter.project = { $in: projects.map((p) => p._id) }
    }

    // Additional filters
    if (status) filter.status = status
    if (priority) filter.priority = priority

    // Find tasks
    const tasks = await Task.find(filter)
      .populate('project', 'title')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid task ID' })
    }

    const task = await Task.findById(req.params.id)
      .populate('project', 'title owner team')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('comments.user', 'name email')

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' })
    }

    // Check if user is authorized to view this task (project owner, team member, or task creator)
    if (
      task.createdBy._id.toString() !== req.user.id &&
      task.project.owner.toString() !== req.user.id &&
      !task.project.team.some((member) => member.toString() === req.user.id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to view this task' })
    }

    res.json({
      success: true,
      data: task,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid task ID' })
    }

    const { title, description, status, priority, assignedTo, deadline } =
      req.body

    // Find task
    let task = await Task.findById(req.params.id).populate(
      'project',
      'owner team'
    )

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' })
    }

    // Check if user is authorized to update this task (project owner, task creator)
    if (
      task.createdBy.toString() !== req.user.id &&
      task.project.owner.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to update this task' })
    }

    // If changing assignee, verify new assignee is part of the project
    if (
      assignedTo &&
      assignedTo !== task.project.owner.toString() &&
      !task.project.team.some((member) => member.toString() === assignedTo)
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Assigned user must be a member of the project',
        })
    }

    // Handle assignee change
    if (
      assignedTo !== undefined &&
      assignedTo !== task.assignedTo?.toString()
    ) {
      // Remove task from previous assignee if any
      if (task.assignedTo) {
        await User.findByIdAndUpdate(task.assignedTo, {
          $pull: { assignedTasks: task._id },
        })
      }

      // Add task to new assignee if any
      if (assignedTo) {
        await User.findByIdAndUpdate(assignedTo, {
          $push: { assignedTasks: task._id },
        })
      }
    }

    // Update task fields
    if (title) task.title = title
    if (description) task.description = description
    if (status) task.status = status
    if (priority) task.priority = priority
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null
    if (deadline) task.deadline = new Date(deadline)

    // Save task
    const updatedTask = await task.save()

    res.json({
      success: true,
      data: updatedTask,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid task ID' })
    }

    // Find task
    const task = await Task.findById(req.params.id).populate('project', 'owner')

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' })
    }

    // Check if user is authorized to delete this task (project owner or task creator)
    if (
      task.createdBy.toString() !== req.user.id &&
      task.project.owner.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to delete this task' })
    }

    // Remove task from project
    await Project.findByIdAndUpdate(task.project._id, {
      $pull: { tasks: task._id },
    })

    // Remove task from assignee if any
    if (task.assignedTo) {
      await User.findByIdAndUpdate(task.assignedTo, {
        $pull: { assignedTasks: task._id },
      })
    }

    // Delete task
    await task.remove()

    res.json({
      success: true,
      message: 'Task deleted',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @route   POST /api/tasks/:id/comment
// @desc    Add comment to task
// @access  Private
router.post(
  '/:id/comment',
  authMiddleware,
  [check('text', 'Comment text is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid task ID' })
      }

      const { text } = req.body

      // Find task
      const task = await Task.findById(req.params.id).populate(
        'project',
        'owner team'
      )

      if (!task) {
        return res
          .status(404)
          .json({ success: false, message: 'Task not found' })
      }

      // Check if user is authorized to comment on this task
      if (
        task.project.owner.toString() !== req.user.id &&
        !task.project.team.some((member) => member.toString() === req.user.id)
      ) {
        return res
          .status(403)
          .json({
            success: false,
            message: 'Not authorized to comment on this task',
          })
      }

      // Add comment
      task.comments.unshift({
        text,
        user: req.user.id,
      })

      // Save task
      await task.save()

      // Get updated task with populated comments
      const updatedTask = await Task.findById(req.params.id).populate(
        'comments.user',
        'name email'
      )

      res.json({
        success: true,
        data: updatedTask.comments,
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ success: false, message: 'Server Error' })
    }
  }
)

module.exports = router
