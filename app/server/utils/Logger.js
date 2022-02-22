// create a stdout console logger
const LOGGER_OPTIONS = {
  timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
}
const LOGGER = require('simple-node-logger').createSimpleLogger(LOGGER_OPTIONS)

LOGGER.setLevel(process.env.LOG_LEVEL || 'info')
const SEPARATOR = ' - '

class Logger {
  constructor() {
    this.log = LOGGER
  }

  info(filename, message, optionalArr) {
    this.log.info(filename, SEPARATOR, message, SEPARATOR, optionalArr)
  }

  error(filename, message, optionalArr) {
    this.log.error(filename, SEPARATOR, message, SEPARATOR, optionalArr)
  }

  warn(filename, message, optionalArr) {
    this.log.warn(filename, SEPARATOR, message, SEPARATOR, optionalArr)
  }
}

module.exports = Logger
