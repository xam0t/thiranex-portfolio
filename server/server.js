require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const testRoutes = require('./routes/testRoutes')
const taskRoutes = require('./routes/taskRoutes')

const app = express()

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/test', testRoutes)
app.use('/api/tasks', taskRoutes)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully')

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:')
    console.error(error.message)
  })

app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Task Manager backend is running!'
  })
})