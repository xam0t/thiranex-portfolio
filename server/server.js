require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Contact = require('./models/Contact')

const app = express()

const PORT = process.env.PORT || 5000

// Allow Express to receive JSON data
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully')

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:')
    console.error(error.message)
  })

// Test API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Portfolio backend is running!'
  })
})
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body

    // Check required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email and message are required.'
      })
    }

    // Validate name
    if (name.trim().length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Name must contain at least 2 characters.'
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

    // Limit message length
    if (message.trim().length < 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Message must contain at least 5 characters.'
      })
    }

    if (message.length > 2000) {
      return res.status(400).json({
        status: 'error',
        message: 'Message cannot exceed 2000 characters.'
      })
    }

    // Save contact message
    const newContact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    })

    const savedContact = await newContact.save()

    res.status(201).json({
      status: 'success',
      message: 'Message received successfully!',
      contact: {
        id: savedContact._id,
        name: savedContact.name,
        email: savedContact.email,
        message: savedContact.message,
        createdAt: savedContact.createdAt
      }
    })

  } catch (error) {

    console.error('Contact API error:', error.message)

    res.status(500).json({
      status: 'error',
      message: 'Unable to process your message right now.'
    })
  }
})