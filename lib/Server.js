'use strict'

const http = require('http')
const https = require('https')
const url = require('url')
const querystring = require('querystring')

/**
 * @class Server
 * @param {object} options
 * @param {number} options.port
 * @param {object} options.https
 * @param {function} callback
 */
const Server = function (options = {}, callback = () => {}) {
  try {
    // define options
    if (typeof options !== 'object') {
      throw new TypeError('Options must be an object')
    }
    this.options = options

    // define routes
    this.routes = {
      GET: {},
      DELETE: {},
      HEAD: {},
      POST: {},
      PUT: {},
      PATCH: {}
    }

    // define middlewares
    this.middlewares = []

    // initialize connection
    const port = this.options.port || 9000
    if (options.https) {
      this.connection = https.createServer(options.https, (req, res) => {
        this._manageRequest(req, res)
      }).listen(port)
    } else {
      this.connection = http.createServer((req, res) => {
        this._manageRequest(req, res)
      }).listen(port)
    }

    // call callback
    callback(null)
  } catch (error) {
    // call callback
    callback(error)
  }
}

/**
 * close(callback) - ()
 * @param {function} callback
 */
Server.prototype.close = function (callback = () => {}) {
  // check parameters
  this._checkCloseParameters(callback)

  // close connection
  this.connection.close(callback)
}

/**
 * get(path, callback)
 * @param {string} path
 * @param {function} callback
 */
Server.prototype.get = function (path, callback) {
  // check parameters
  this._checkRouteParameters(path, callback)

  // save route
  this.routes.GET[path] = callback
}

/**
 * delete(path, callback)
 * @param {string} path
 * @param {function} callback
 */
Server.prototype.delete = function (path, callback) {
  // check parameters
  this._checkRouteParameters(path, callback)

  // save route
  this.routes.DELETE[path] = callback
}

/**
 * head(path, callback)
 * @param {string} path
 * @param {function} callback
 */
Server.prototype.head = function (path, callback) {
  // check parameters
  this._checkRouteParameters(path, callback)

  // save route
  this.routes.HEAD[path] = callback
}

/**
 * post(path, callback)
 * @param {string} path
 * @param {function} callback
 */
Server.prototype.post = function (path, callback) {
  // check parameters
  this._checkRouteParameters(path, callback)

  // save route
  this.routes.POST[path] = callback
}

/**
 * put(path, callback)
 * @param {string} path
 * @param {function} callback
 */
Server.prototype.put = function (path, callback) {
  // check parameters
  this._checkRouteParameters(path, callback)

  // save route
  this.routes.PUT[path] = callback
}

/**
 * patch(path, callback)
 * @param {string} path
 * @param {function} callback
 */
Server.prototype.patch = function (path, callback) {
  // check parameters
  this._checkRouteParameters(path, callback)

  // save route
  this.routes.PATCH[path] = callback
}

/**
 * use(path, middleware)
 * @param {string} middleware
 * @param {function} middleware
 */
Server.prototype.use = function (path, middleware) {
  // check parameters
  this._checkMiddlewareParameters(path, middleware)

  // save middleware
  this.middlewares.push({
    path: path,
    middleware: middleware
  })
}

/**
 * _manageRequest(req, res)
 * @param {object} req
 * @param {object} res
 */
Server.prototype._manageRequest = function (req, res) {
  try {
    // get url info
    const urlInfo = url.parse(req.url)

    // add request custom data
    req.path = urlInfo.pathname.length > 1 ? urlInfo.pathname.replace(/\/$/, '') : urlInfo.pathname
    req.query = querystring.parse(urlInfo.query) || {}
    req.body = {}

    // add response custom data
    res.send = (content, statusCode = 200) => this._sendContent(res, content, statusCode)
    res.sendStatus = (statusCode = 200) => this._sendStatus(res, statusCode)

    // find callback
    const callback = this.routes[req.method][req.path]

    // return 404 if callback is not present
    if (!callback) {
      this._sendStatus(res, 404)
      return
    }

    // call middleware and callback
    setImmediate(() => this._manageMiddlewares(req, res, callback))
  } catch (error) {
    this._sendStatus(res, 500)
  }
}

/**
 * _manageMiddlewares(req, res, callback, index = 0)
 * @param {object} req
 * @param {object} res
 * @param {function} callback
 * @param {number} index
 */
Server.prototype._manageMiddlewares = function (req, res, callback, index = 0) {
  // find middleware
  const middleObj = this.middlewares[index]

  // call callback if middleware not present
  if (!middleObj) {
    callback(req, res)
    return
  }

  // manage path if middleware has path
  let permitCall = false
  if (middleObj.path) {
    permitCall = req.path.substring(0, middleObj.path.length) === middleObj.path
  } else {
    permitCall = true
  }

  if (permitCall) {
    middleObj.middleware(req, res, () => {
      this._manageMiddlewares(req, res, callback, index + 1)
    })
  } else {
    this._manageMiddlewares(req, res, callback, index + 1)
  }
}

/**
 * _sendContent(res, content, statusCode = 200)
 * @param {object} res
 * @param {*} content
 * @param {number} statusCode
 */
Server.prototype._sendContent = function (res, content, statusCode = 200) {
  // set response status code
  res.statusCode = statusCode

  // set response content
  if (typeof content === 'string') {
    res.setHeader('Content-Type', 'text/plain')
    res.write(content)
  } else if (typeof content === 'object') {
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify(content))
  }

  // close response
  res.end()
}

/**
 * _sendStatus(res, statusCode)
 * @param {object} res
 * @param {number} statusCode
 */
Server.prototype._sendStatus = function (res, statusCode = 200) {
  // set response status code
  res.statusCode = statusCode
  res.end()
}

/**
 * _checkRouteParameters(path, callback)
 * @param {string} path
 * @param {function} callback
 */
Server.prototype._checkRouteParameters = function (path, callback) {
  // check path
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string')
  }

  // check callback
  if (typeof callback !== 'function') {
    throw new TypeError('Callback must be a function')
  }
}

/**
 * _checkMiddlewareParameters(path, middleware)
 * @param {function} middleware
 */
Server.prototype._checkMiddlewareParameters = function (path, middleware) {
  // check path
  if (path && typeof path !== 'string') {
    throw new TypeError('Path must be a string')
  }

  // check middleware
  if (typeof middleware !== 'function') {
    throw new TypeError('Middleware must be a function')
  }
}

/**
 * _checkCloseParameters(callback)
 * @param {function} callback
 */
Server.prototype._checkCloseParameters = function (callback) {
  // check middleware
  if (typeof callback !== 'function') {
    throw new TypeError('Callback must be a function')
  }
}

module.exports = Server
