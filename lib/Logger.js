'use strict'

const path = require('path')
const fs = require('fs')
const console = require('console')

/**
 * @class Logger
 * @param {object} options
 * @param {boolean} options.consoleLog
 * @param {boolean} options.writeLogOut
 * @param {boolean} options.writeLogErr
 * @param {string} options.logOutPath
 * @param {string} options.logErrPath
 */
const Logger = function (options = {}) {
  // define options
  if (typeof options !== 'object') {
    throw new TypeError('Options must be an object')
  }
  this.options = options
  // define log streams
  const logOutPath = this.options.logOutPath || `${path.dirname(require.main.filename)}/log/log_out.log`
  this.logOutStream = fs.createWriteStream(logOutPath)
  const logErrPath = this.options.logErrPath || `${path.dirname(require.main.filename)}/log/log_err.log`
  this.logErrStream = fs.createWriteStream(logErrPath)
  // define logger
  this.logger = new console.Console(this.logOutStream, this.logErrStream)
}

/**
 * middleware(req, res, next)
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
Logger.prototype.middleware = function (req, res, next) {
  setImmediate(() => {
    // define request informations string
    const reqInfo = `[${Date.now()}] - ${req.method} - ${req.url}`

    // write request informations on log
    if (this.options.writeLogOut) { this.log(reqInfo) }

    // write request on development console
    this._writeOnConsole(reqInfo)
  })

  next()
}

/**
 * log(content)
 * @param {string} content
 */
Logger.prototype.log = function (...args) {
  setImmediate(() => {
    if (this.options.writeLogOut) { this.logger.log(args) }

    // write info on development console
    this._writeOnConsole(...args)
  })
}

/**
 * info(content)
 * @param {string} content
 */
Logger.prototype.info = function (...args) {
  setImmediate(() => {
    if (this.options.writeLogOut) { this.logger.info(args.toString()) }

    // write info on development console
    this._writeOnConsole(...args)
  })
}

/**
 * error(content)
 * @param {string} content
 */
Logger.prototype.error = function (...args) {
  setImmediate(() => {
    if (this.options.writeLogErr) { this.logger.error(args) }

    // write info on development console
    this._writeOnConsole(...args)
  })
}

/**
 * getLogger()
 */
Logger.prototype.getLogger = function () {
  return this.logger
}

/**
 * _writeOnConsole(coontent)
 * @param {string} content
 */
Logger.prototype._writeOnConsole = function (...args) {
  if (this.options.consoleLog) {
    console.log(args.toString())
  }
}

module.exports = Logger
