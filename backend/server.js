const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

// Load environment variables
dotenv.config()

// Require route files
const authRoutes = require('./routes/auth')
const projectRoutes = require('./routes/projects')
const taskRoutes = require('./routes/tasks')

const app = express()

// Middleware
app.use(cors())
app.use(express.json()) // for parsing application/json

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB Connected')
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    // Exit process with failure
    process.exit(1)
  }
}

connectDB()

// Basic route
app.get('/', (req, res) => {
  res.send('Projexa API is running...')
})

// Mount routers
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
})

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${
      process.env.NODE_ENV || 'development'
    } mode on port ${PORT}`
  )
)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`)
  // Close server & exit process
  server.close(() => process.exit(1))
})
