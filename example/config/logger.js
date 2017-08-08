const Logger = require('../../index').Logger

const logger = new Logger({
  consoleLog: true,
  writeLogErr: true
})

module.exports = logger
