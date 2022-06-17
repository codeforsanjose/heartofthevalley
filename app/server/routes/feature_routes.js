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
//Features using all the art_type
router.get('/features/:art_type?', (req, res) => {
  let { art_type } = req.params
  const data = artDB.getAllFeatures()
  if (!data || data.length === 0) {
    logger.error(FILENAME, 'No data in cache', artDB.keys())
    res.status(204)
    res.end()
    return
  }
  if (!art_type || art_type === ""){
    res.json(data)
    return
  }
  const feature = data.filter((item) => item.type.toLowerCase().includes(art_type.toLowerCase()))
  if (!feature) {
    logger.error(FILENAME, 'Query not found', query)
    res.status(204)
    res.end()
    return
  }
  res.json(feature)
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
//Search all the art by using some query
router.get('/search/:query/:art_type?', (req, res) => {
  let { query } = req.params
  let { art_type } = req.params
  if (query.length == 0) {
    logger.error(FILENAME, 'Empty Query', query)
    res.status(400)
    res.json({
      name: 'INVALID_REQUEST',
      message: 'The request is not well-formed, is syntactically incorrect, or violates schema.',
      details: [
        {
          field: '/query',
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
  query = query.toLowerCase()
  const feature = data.filter(item => {
  return (item.title.toLowerCase().includes(query) || item.facility.toLowerCase().includes(query) || item.descriptionHtml.toLowerCase().includes(query)
  || item.artistName.toLowerCase().includes(query) || item.address.toLowerCase().includes(query) || item.city.toLowerCase().includes(query)
        )
  })
  if (!feature) {
    logger.error(FILENAME, 'Query not found', query)
    res.status(204)
    res.end()
    return
  }
  if (!art_type || art_type === ""){
    res.json(feature)
    return
  }
  art = feature.filter(item => item.type.toLowerCase().includes(art_type.toLowerCase()))
  if (!art){
    logger.error(FILENAME, 'Art type not found', zip)
    res.status(204)
    res.end()
    return
  }
  res.json(art)
})
router.get('/zipcode/:zip/:art_type?', (req, res) => {
  let { zip } = req.params
  let {art_type} = req.params
  zip = parseInt(zip, 10)
  if (!Number.isInteger(zip)) {
    logger.error(FILENAME, 'Invalid Param', zip)
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
  const feature = data.filter((item) => item.zipcode == zip)
  if (!feature) {
    logger.error(FILENAME, 'Postal code not found', zip)
    res.status(204)
    res.end()
    return
  }
  if (!art_type || art_type.length === ""){
    res.json(feature)
    return
  }
  art = feature.filter(item => item.type.toLowerCase().includes(art_type.toLowerCase()))
  if (!art){
    logger.error(FILENAME, 'Art type not found', zip)
    res.status(204)
    res.end()
    return
  }
  res.json(art)
})


//All art from certain distance
router.get('/nearby/:lat1/:long1/:distance?', (req, res) => {
  let { lat1 } = req.params
  let { long1 } = req.params
  let { distance } = req.params
  if (lat1.length == 0 || long1.length == 0 || distance.length == 0) {
    logger.error(FILENAME, 'Empty Query', query)
    res.status(400)
    res.json({
      name: 'INVALID_REQUEST',
      message: 'The request is not well-formed, is syntactically incorrect, or violates schema.',
      details: [
        {
          field: '/query',
          issue: 'INVALID_PARAMETER_ISSUE',
          location: 'params',
          description: 'Invalid parameter value.',
        },
      ],
    })
    return
  }
  lat1 = parseFloat(lat1)
  long1 = parseFloat(long1)
  distance = parseFloat(distance)
  const data = artDB.getAllFeatures()
  if (!data || data.length === 0) {
    logger.error(FILENAME, 'No data in cache', artDB.keys())
    res.status(204)
    res.end()
    return
  }
  function toRad(Value)
    {
        return Value * Math.PI / 180;
    }
  function calcCrow(lat1, lon1, lat2, lon2)
    {
      var R = 3959; // miles
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
      return d;
  }
  const feature = data.filter((item) => {
    if (item.latLong[0] === "" || item.latLong[1] === ""){
        return false
    }
    return calcCrow(item.latLong[0], item.latLong[1], lat1, long1) < distance
  }) //Change this to search artist name
  if (!feature) {
    logger.error(FILENAME, 'Query not found', query)
    res.status(204)
    res.end()
    return
  }
  res.json(feature)
})

//[Optional] The Query using Artist
router.get('/artist/:query', (req, res) => {
  let { query } = req.params
  if (query.length == 0) {
    logger.error(FILENAME, 'Empty Query', query)
    res.status(400)
    res.json({
      name: 'INVALID_REQUEST',
      message: 'The request is not well-formed, is syntactically incorrect, or violates schema.',
      details: [
        {
          field: '/query',
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
  const feature = data.filter((item) => item.title.includes(query)) //Change this to search artist name
  if (!feature) {
    logger.error(FILENAME, 'Query not found', query)
    res.status(204)
    res.end()
    return
  }
  res.json(feature)
})





module.exports = router
