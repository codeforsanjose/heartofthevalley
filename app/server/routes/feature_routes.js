const express = require('express')
const ArtDB = require('../models/ArtDB')
const Logger = require('../utils/Logger')

const artDB = new ArtDB()
const logger = new Logger()
const router = express.Router()
const FILENAME = 'feature_routes'

router.use((req, res, next) => {
  logger.info(FILENAME, `${req.url} called`)
  next()
})

router.get('/ping', (req, res) => {
  res.send('Hi There')
})

// Get all features
router.get('/features', (req, res) => {
  const data = artDB.getAllFeatures()
  if (!data || data.length === 0) {
    logger.error(FILENAME, 'No data in cache', artDB.keys())
    res.status(204)
    res.end()
    return
  }
  res.json(data)
})

// Get feature by id
router.get('/feature/:id', (req, res) => {
  let { id } = req.params
  id = parseInt(id, 10)
  if (!Number.isInteger(id)) {
    logger.error(FILENAME, 'Invalid Param', id)
    res.status(400)
    res.json({
      name: 'INVALID_REQUEST',
      message: 'The request is not well-formed, is syntactically incorrect, or violates schema.',
      details: [
        {
          field: '/id',
          issue: 'INVALID_PARAMETER_ISSUE',
          location: 'params',
          description: 'Invalid parameter value.',
        },
      ],
    })
    return
  }
  const data = artDB.getAllFeatures()
  if (!data || data.length === 0) {
    logger.error(FILENAME, 'No data in cache', artDB.keys())
    res.status(204)
    res.end()
    return
  }
  const feature = data.find((item) => item.id === id)
  if (!feature) {
    logger.error(FILENAME, 'Id not found', id)
    res.status(204)
    res.end()
    return
  }
  res.json(feature)
})

module.exports = router
