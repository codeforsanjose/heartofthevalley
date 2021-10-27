const express = require('express')
const cors = require('cors')
const app = express()
const router = express.Router()
const featureRoutes = require('./routes/feature_routes')

// Enable cors security headers
app.use(cors())

// add an express method to parse the POST method
app.use(express.json())
app.use(router)
app.use(express.urlencoded({ extended: true }))

// Connect feature routes
app.use('/v1/heartofvalley', featureRoutes)

app.listen('3001', () => {
  console.log('')
})
