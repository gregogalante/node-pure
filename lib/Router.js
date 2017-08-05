const querystring = require('querystring')

/**
 * Router.
 */
const Router = function (options) {
  // define options
  this.options = options || {}
  if (typeof options !== 'object') {
    throw new TypeError('Options must be an object')
  }
  this.options.statusCode = this.options.statusCode || 200
  this.options.contentType = this.options.contentType || 'text/plain'
  // define middlewares
  this.middlewares = []
  // define routes
  this.routes = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {}
  }
}

/**
 * addRoute().
 * @param {string} method.
 * @param {string} path.
 * @param {function} callback.
 */
Router.prototype.addRoute = function (method, path, callback) {
  // check method
  if (typeof method !== 'string') {
    throw new TypeError('Method must be a string')
  }
  // check path
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string')
  }
  // check callback
  if (typeof callback !== 'function') {
    throw new TypeError('Callback must be a function')
  }
  // save new route
  this.routes[method][path] = callback
}

/**
 * addMiddleware(middleware)
 * @param {function} middleware.
 */
Router.prototype.addMiddleware = function (middleware) {
  // check middleware
  if (typeof middleware !== 'function') {
    throw new TypeError('Middleware must be a function')
  }
  // save new middlewares
  this.middlewares.push(middleware)
}

/**
 * manageRequest(req, res)
 * @param {object} req.
 * @param {object} res.
 */
Router.prototype.manageRequest = function (req, res) {
  // set response default configs
  res.statusCode = this.options.statusCode
  res.setHeader('Content-Type', this.options.contentType)
  // set response default functions
  res.sendCode = (code) => this._sendCode(res, code)
  res.send = (content) => this._send(res, content)
  // set request default configs
  const queryInit = req.url.indexOf('?')
  req.path = queryInit >= 0 ? req.url.substr(0, queryInit) : req.url
  req.query = queryInit >= 0 ? querystring.parse(req.url.substr(queryInit + 1, req.url.length)) : {}
  // call correct callback
  const callback = this.routes[req.method][req.path]
  if (callback && req.method !== 'GET') {
    req.on('data', (data) => {
      req.body += data
    })
    req.on('end', () => {
      this._callMiddleware(0, callback, req, res)
    })
  } else if (callback) {
    this._callMiddleware(0, callback, req, res)
  } else {
    this._sendCode(res, 404)
  }
}

/**
 * _callMiddleware()
 * @param {number} index.
 * @param {array} middlewares.
 * @param {function} callback.
 * @param {object} req.
 * @param {object} res.
 */
Router.prototype._callMiddleware = function (index, callback, req, res) {
  if (this.middlewares[index]) {
    this.middlewares[index](req, res, () => this._callMiddleware(index + 1, callback, req, res))
  } else {
    callback(req, res)
  }
}

/**
 * _sendCode(res, code)
 * @param {object} res.
 * @param {number} code.
 */
Router.prototype._sendCode = function (res, code) {
  res.statusCode = code
  res.end()
}

/**
 * _send(res, content)
 * @param {object} res.
 * @param {*} content.
 */
Router.prototype._send = function (res, content) {
  if (typeof content === 'string') {
    res.setHeader('Content-Type', 'text/plain')
    res.write(content)
  } else if (typeof content === 'object') {
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify(content))
  }
  res.end()
}

module.exports = Router
