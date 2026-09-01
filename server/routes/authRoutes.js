const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email and password are required.'
      })
    }

    // Validate name
    if (name.trim().length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Name must contain at least 2 characters.'
      })
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must contain at least 6 characters.'
      })
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please enter a valid email address.'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase()
    })

    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'An account with this email already exists.'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword
    })

    const savedUser = await newUser.save()

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully!',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    })

  } catch (error) {
    console.error('Registration error:', error.message)

    res.status(500).json({
      status: 'error',
      message: 'Unable to create account right now.'
    })
  }
})

// Login an existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required.'
      })
    }

    // Find user
    const user = await User.findOne({
      email: email.trim().toLowerCase()
    })

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.'
      })
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.'
      })
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    )

    res.json({
      status: 'success',
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Login error:', error.message)

    res.status(500).json({
      status: 'error',
      message: 'Unable to login right now.'
    })
  }
})

module.exports = router