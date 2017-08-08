'use strict'

const path = require('path')
const fs = require('fs')
const console = require('console')

/**
 * Debugger
 * @param {object} options
 *
 * options: {
 *  envProd: {boolean} - false
 *  logOut: {string} - ./log/log_out.log,
 *  logErr: {string} - ./log/log_err.log
 * }
 */
const Debugger = function (options = {}) {
  // define options
  if (typeof options !== 'object') {
    throw new TypeError('Options must be an object')
  }
  this.options = options
  // define log streams
  const logOut = this.options.logOut || `${path.dirname(require.main.filename)}/log/log_out.log`
  this.logOutStream = fs.createWriteStream(logOut)
  const logErr = this.options.logErr || `${path.dirname(require.main.filename)}/log/log_err.log`
  this.logErrStream = fs.createWriteStream(logErr)
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
    this.logger.info(reqInfo)

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
  this.logger.log(content)

  // write info on development console
  this._writeOnConsole(content)
}

/**
 * info(content)
 * @param {string} content
 */
Debugger.prototype.info = function (content) {
  this.logger.info(content)

  // write info on development console
  this._writeOnConsole(content)
}

/**
 * error(content)
 * @param {string} content
 */
Debugger.prototype.error = function (content) {
  this.logger.error(content)

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
  if (!this.options.envProd) {
    console.log(content)
  }
}

module.exports = Debugger
