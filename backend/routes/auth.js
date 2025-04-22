const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')

// Import User model
const User = require('../models/User')

// Import auth middleware
const authMiddleware = require('../middleware/auth')

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // Find user by id, exclude password
    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({
      min: 6,
    }),
    check('role', 'Role is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { name, email, password, role } = req.body

    try {
      // Check if user exists
      let user = await User.findOne({ email })

      if (user) {
        return res
          .status(400)
          .json({ success: false, message: 'User already exists' })
      }

      // Create new user
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      user = new User({
        name,
        email,
        password: hashedPassword,
        role,
      })

      await user.save()

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
        },
      }

      // Sign token
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1d' },
        (err, token) => {
          if (err) throw err

          const userData = user.toObject()
          delete userData.password

          res.json({
            success: true,
            token,
            user: userData,
          })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).json({ success: false, message: 'Server Error' })
    }
  }
)

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      // Find user
      let user = await User.findOne({ email })

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid credentials' })
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid credentials' })
      }

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
        },
      }

      // Sign token
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1d' },
        (err, token) => {
          if (err) throw err

          const userData = user.toObject()
          delete userData.password

          res.json({
            success: true,
            token,
            user: userData,
          })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).json({ success: false, message: 'Server Error' })
    }
  }
)

// @route   GET /api/auth/users
// @desc    Get all users (for team selection)
// @access  Private
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json({
      success: true,
      data: users,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

module.exports = router
