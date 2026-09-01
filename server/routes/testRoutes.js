const express = require('express')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/protected', protect, (req, res) => {
  res.json({
    status: 'success',
    message: 'You accessed a protected route!',
    userId: req.userId
  })
})

module.exports = router