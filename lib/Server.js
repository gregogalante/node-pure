const http = require('http')
const https = require('https')

const Router = require('./Router')

/**
 * Server.
 * @param {object} options.
 */
const Server = function (options) {
  // define options
  this.options = options || {}
  if (typeof options !== 'object') {
    throw new TypeError('Options must be an object')
  }
  // define router
  const routerOptions = this.options.router || {}
  this.router = new Router(routerOptions)
  // define server
  const port = this.options.port || 9000
  if (options.https) {
    this.server = https.createServer(options.https, (req, res) => {
      this.router.manage(req, res)
    }).listen(port)
  } else {
    this.server = http.createServer((req, res) => {
      this.router.manage(req, res)
    }).listen(port)
  }
}

/**
 * options().
 * @param {string} path.
 * @param {function} callback.
 */
Server.prototype.options = function (path, callback) {
  this.router.add('OPTIONS', path, callback)
}

/**
 * get().
 * @param {string} path.
 * @param {function} callback.
 */
Server.prototype.get = function (path, callback) {
  this.router.add('GET', path, callback)
}

/**
 * head().
 * @param {string} path.
 * @param {function} callback.
 */
Server.prototype.head = function (path, callback) {
  this.router.add('HEAD', path, callback)
}

/**
 * post().
 * @param {string} path.
 * @param {function} callback.
 */
Server.prototype.post = function (path, callback) {
  this.router.add('POST', path, callback)
}

/**
 * put().
 * @param {string} path.
 * @param {function} callback.
 */
Server.prototype.put = function (path, callback) {
  this.router.add('PUT', path, callback)
}

/**
 * delete().
 * @param {string} path.
 * @param {function} callback.
 */
Server.prototype.delete = function (path, callback) {
  this.router.add('DELETE', path, callback)
}

/**
 * trace().
 * @param {string} path.
 * @param {function} callback.
 */
Server.prototype.trace = function (path, callback) {
  this.router.add('TRACE', path, callback)
}

/**
 * connect().
 * @param {string} path.
 * @param {function} callback.
 */
Server.prototype.connect = function (path, callback) {
  this.router.add('CONNECT', path, callback)
}

module.exports = Server
