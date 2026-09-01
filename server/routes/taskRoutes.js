const express = require('express')
const Task = require('../models/Task')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

// GET all tasks belonging to logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.userId
    }).sort({
      createdAt: -1
    })

    res.json({
      status: 'success',
      tasks
    })

  } catch (error) {
    console.error('Get tasks error:', error.message)

    res.status(500).json({
      status: 'error',
      message: 'Unable to fetch tasks.'
    })
  }
})

// CREATE a new task
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate
    } = req.body

    if (!title || title.trim().length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Task title must contain at least 2 characters.'
      })
    }

    const newTask = new Task({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      user: req.userId
    })

    const savedTask = await newTask.save()

    res.status(201).json({
      status: 'success',
      message: 'Task created successfully!',
      task: savedTask
    })

  } catch (error) {
    console.error('Create task error:', error.message)

    res.status(500).json({
      status: 'error',
      message: 'Unable to create task.'
    })
  }
})

// UPDATE a task
router.put('/:id', protect, async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate
    } = req.body

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId
    })

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found.'
      })
    }

    if (title !== undefined && title.trim().length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Task title must contain at least 2 characters.'
      })
    }

    if (title !== undefined) {
      task.title = title.trim()
    }

    if (description !== undefined) {
      task.description = description.trim()
    }

    if (status !== undefined) {
      task.status = status
    }

    if (priority !== undefined) {
      task.priority = priority
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate || null
    }

    const updatedTask = await task.save()

    res.json({
      status: 'success',
      message: 'Task updated successfully!',
      task: updatedTask
    })

  } catch (error) {
    console.error('Update task error:', error.message)

    res.status(500).json({
      status: 'error',
      message: 'Unable to update task.'
    })
  }
})


// DELETE a task
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId
    })

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found.'
      })
    }

    await Task.deleteOne({
      _id: req.params.id
    })

    res.json({
      status: 'success',
      message: 'Task deleted successfully!'
    })

  } catch (error) {
    console.error('Delete task error:', error.message)

    res.status(500).json({
      status: 'error',
      message: 'Unable to delete task.'
    })
  }
})

module.exports = router