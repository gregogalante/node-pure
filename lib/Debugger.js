'use strict'

const path = require('path')
const fs = require('fs')
const console = require('console')

/**
 * @class Debugger
 * @param {object} options
 * @param {boolean} options.consoleLog
 * @param {boolean} options.writeLog
 * @param {string} options.logOutPath
 * @param {string} options.logErrPath
 */
const Debugger = function (options = {}) {
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
Debugger.prototype.middleware = function (req, res, next) {
  setImmediate(() => {
    // define request informations string
    const reqInfo = `[${Date.now()}] - ${req.method} - ${req.url}`

    // write request informations on log
    if (this.options.writeLog) { this.log(reqInfo) }

    // write request on development console
    this._writeOnConsole(reqInfo)
  })

  next()
}

/**
 * log(content)
 * @param {string} content
 */
Debugger.prototype.log = function (content) {
  if (this.options.writeLog) { this.logger.log(content) }

  // write info on development console
  this._writeOnConsole(content)
}

/**
 * info(content)
 * @param {string} content
 */
Debugger.prototype.info = function (content) {
  if (this.options.writeLog) { this.logger.info(content) }

  // write info on development console
  this._writeOnConsole(content)
}

/**
 * error(content)
 * @param {string} content
 */
Debugger.prototype.error = function (content) {
  if (this.options.writeLog) { this.logger.error(content) }

  // write info on development console
  this._writeOnConsole(content)
}

/**
 * getLogger()
 */
Debugger.prototype.getLogger = function () {
  return this.logger
}

/**
 * _writeOnConsole(coontent)
 * @param {string} content
 */
Debugger.prototype._writeOnConsole = function (content) {
  if (this.options.consoleLog) {
    console.log(content)
  }
}

module.exports = Debugger
