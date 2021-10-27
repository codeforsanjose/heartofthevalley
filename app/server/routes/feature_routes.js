const express = require('express')

const router = express.Router()

router.use((request, response, next) => {
  console.log('middleware called')
  next()
})

router.get('/ping', (req, res) => {
  console.log('/ping called')
  res.send('Hi There')
})

// Get all features
router.get('/features', (req, res) => {
  res.send('Hi There')
})

module.exports = router
