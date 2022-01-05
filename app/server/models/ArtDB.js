const NodeCache = require('node-cache')
const { CACHE_KEY_FEATURES } = require('../utils/Constants')

const myCache = new NodeCache()

class ArtDB {
  constructor() {
    this.myCache = myCache
  }

  getAllFeatures() {
    const data = this.myCache.has(CACHE_KEY_FEATURES) ? myCache.get(CACHE_KEY_FEATURES) : []
    return data
  }

  saveFeatures(data) {
    this.myCache.set(CACHE_KEY_FEATURES, data)
  }

  keys() {
    return this.myCache.keys()
  }
}

module.exports = ArtDB
