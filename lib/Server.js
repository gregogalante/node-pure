const http = require('http')
const https = require('https')
const querystring = require('querystring')

/**
 * Server
 * @param {object} options
 * @param {function} callback
 */
const Server = function (options, callback = () => {}) {
  try {
    // define options
    this.options = options || {}
    if (typeof options !== 'object') {
      throw new TypeError('Options must be an object')
    }

    // define routes
    this.routes = {
      GET: {},
      POST: {},
      PUT: {},
      DELETE: {}
    }

    // define middlewares
    this.middlewares = []

    // initialize connection
    const port = this.options.port || 9000
    if (options.https) {
      this.connection = https.createServer(options.https, (req, res) => {
        this.__manageRequest(req, res)
      }).listen(port)
    } else {
      this.connection = http.createServer((req, res) => {
        this.__manageRequest(req, res)
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
 * close(callback)
 */
Server.prototype.close = function (callback = () => {}) {
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
 * middleware(middleware)
 * @param {function} middleware
 */
Server.prototype.middleware = function (middleware) {
  // check parameters
  this._checkMiddlewareParameters(middleware)

  // save middleware
  this.middlewares.push(middleware)
}

/**
 * _manageRequest(req, res)
 * @param {object} req
 * @param {object} res
 */
Server.prototype.__manageRequest = function (req, res) {
  // set request path
  const queryInitIndex = req.url.indexOf('?')
  req.path = queryInitIndex >= 0 ? req.url.substr(0, queryInitIndex) : req.url

  // find callback
  const callback = this.routes[req.method][req.path]

  // return 404 if callback is not present
  if (!callback) {
    res.statusCode = 404
    res.end()
    return
  }

  // add request custom data
  req.query = queryInitIndex >= 0 ? querystring.parse(req.url.substr(queryInitIndex + 1, req.url.length)) : {}
  req.body = ''

  // add response custom data
  res.send = (content) => this._sendContent(res, content)

  // call middleware and callback
  req.on('data', (data) => {
    // add data to body
    req.body += data

    // close connection if data is too big
    if (req.body.length > 1e6) { // TODO: Make it dynamic
      req.connection.destroy()
    }
  })
  req.on('end', () => {
    // call middleware
    this._manageMiddlewares(req, res, callback)
  })
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
  const middleware = this.middlewares[index]

  // call callback if middleware not present
  if (!middleware) {
    callback(req, res)
    return
  }

  // call middleware
  middleware(req, res, () => {
    this._manageMiddlewares(req, res, callback, index + 1)
  })
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
 * _checkMiddlewareParameters(middleware)
 * @param {function} middleware
 */
Server.prototype._checkMiddlewareParameters = function (middleware) {
  // check middleware
  if (typeof middleware !== 'function') {
    throw new TypeError('Middleware must be a function')
  }
}

module.exports = Server