const { DATA_FILE_NAME, DEFAULT_FEATURE_IMAGE } = require('../utils/Constants')
const fs = require('fs')
const path = require('path')
const csv = require('fast-csv')
const ArtDB = require('../models/ArtDB')
const Logger = require('../utils/Logger')
const logger = new Logger()
const artDB = new ArtDB()
const FILENAME = 'data'

let id = 1
function loadData() {
  fs.createReadStream(path.resolve(__dirname, '', DATA_FILE_NAME))
    .pipe(
      csv.parse({ headers: true, skipLines: 2 }).transform((data) => ({
        ...data,
        id: id++,
        title: data.title ? removeWhiteSpaces(data.title) : '',
        latLong: data.latLong ? removeWhiteSpaces(data.latLong) : '',
        imagePath: data.imagePath ? removeWhiteSpaces(data.imagePath) : DEFAULT_FEATURE_IMAGE,
        enabled: data.enabled && data.enabled === 'false' ? false : true,
      })),
    )
    .on('error', (error) => console.error(error))
    .on('data', (row) => {
      let data = artDB.getAllFeatures()
      data.push(row)
      artDB.saveFeatures(data)
    })
    .on('end', (rowCount) => {
      let data = artDB.getAllFeatures()
      logger.info(FILENAME, `Parsed: ${rowCount} rows`)
      logger.info(FILENAME, `Cache: ${data.length} rows`)
    })
}

function removeWhiteSpaces(value) {
  return value.replace(/\s+/g, '')
}

module.exports = loadData
