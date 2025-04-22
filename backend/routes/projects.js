const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const mongoose = require('mongoose')

// Load models
const Project = require('../models/Project')
const User = require('../models/User')

// Auth middleware to protect routes
const authMiddleware = require('../middleware/auth')

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post(
  '/',
  authMiddleware,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    try {
      const { title, description, deadline, team } = req.body

      // Create new project
      const newProject = new Project({
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        owner: req.user.id,
        team: team || [],
      })

      // Save project
      const project = await newProject.save()

      // Update user's createdProjects
      await User.findByIdAndUpdate(
        req.user.id,
        { $push: { createdProjects: project._id } },
        { new: true }
      )

      // If team members are specified, update their assignedProjects
      if (team && team.length > 0) {
        await User.updateMany(
          { _id: { $in: team } },
          { $push: { assignedProjects: project._id } }
        )
      }

      res.json({
        success: true,
        data: project,
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ success: false, message: 'Server Error' })
    }
  }
)

// @route   GET /api/projects
// @desc    Get all projects for a user (created or assigned)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Find all projects where user is owner or team member
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { team: req.user.id }],
    })
      .populate('owner', 'name email')
      .populate('team', 'name email')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid project ID' })
    }

    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('team', 'name email')
      .populate({
        path: 'tasks',
        select: 'title status priority deadline assignedTo',
        populate: {
          path: 'assignedTo',
          select: 'name email',
        },
      })

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found' })
    }

    // Check if user is authorized to view this project
    if (
      project.owner._id.toString() !== req.user.id &&
      !project.team.some((member) => member._id.toString() === req.user.id)
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: 'Not authorized to view this project',
        })
    }

    res.json({
      success: true,
      data: project,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put(
  '/:id',
  authMiddleware,
  [
    check('title', 'Title is required').optional().not().isEmpty(),
    check('description', 'Description is required').optional().not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid project ID' })
      }

      const { title, description, deadline, status, team } = req.body

      // Find project
      let project = await Project.findById(req.params.id)

      if (!project) {
        return res
          .status(404)
          .json({ success: false, message: 'Project not found' })
      }

      // Check if user is authorized to update this project
      if (project.owner.toString() !== req.user.id) {
        return res
          .status(403)
          .json({
            success: false,
            message: 'Not authorized to update this project',
          })
      }

      // Update project fields
      if (title) project.title = title
      if (description) project.description = description
      if (deadline) project.deadline = new Date(deadline)
      if (status) project.status = status

      // Handle team members if specified
      if (team) {
        // Get existing team members
        const existingTeam = [...project.team.map((id) => id.toString())]

        // Find members to remove and add
        const membersToRemove = existingTeam.filter((id) => !team.includes(id))
        const membersToAdd = team.filter((id) => !existingTeam.includes(id))

        // Update users' assignedProjects
        if (membersToRemove.length > 0) {
          await User.updateMany(
            { _id: { $in: membersToRemove } },
            { $pull: { assignedProjects: project._id } }
          )
        }

        if (membersToAdd.length > 0) {
          await User.updateMany(
            { _id: { $in: membersToAdd } },
            { $push: { assignedProjects: project._id } }
          )
        }

        // Update project team
        project.team = team
      }

      // Save project
      const updatedProject = await project.save()

      res.json({
        success: true,
        data: updatedProject,
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ success: false, message: 'Server Error' })
    }
  }
)

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid project ID' })
    }

    // Find project
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found' })
    }

    // Check if user is authorized to delete this project
    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          success: false,
          message: 'Not authorized to delete this project',
        })
    }

    // Remove project references from users
    await User.updateMany(
      {
        $or: [
          { createdProjects: project._id },
          { assignedProjects: project._id },
        ],
      },
      {
        $pull: {
          createdProjects: project._id,
          assignedProjects: project._id,
        },
      }
    )

    // Delete all tasks associated with this project
    await mongoose.model('Task').deleteMany({ project: project._id })

    // Delete project
    await project.remove()

    res.json({
      success: true,
      message: 'Project deleted',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

module.exports = router
