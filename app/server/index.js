const express = require('express')
const cors = require('cors')

const config = require('./config');
const app = express()
const router = express.Router()
const featureRoutes = require('./routes/feature_routes')
const PORT = process.env.PORT || 3001

const ArtDB = require('./models/ArtDB')
const artDB = new ArtDB()
// Enable cors security headers
app.use(cors())

// add an express method to parse the POST method
app.use(express.json())
app.use(router)
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Connect feature routes
app.use(config.baseUrl, featureRoutes)

// Load Data into Cache
const loadData = require('./data')
loadData()

app.listen(PORT, () => {
  console.log('Listening on: ', PORT)
})
