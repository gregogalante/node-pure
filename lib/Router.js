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
  // define initial routes
  this.routes = {
    OPTIONS: {},
    GET: {},
    HEAD: {},
    POST: {},
    PUT: {},
    DELETE: {},
    TRACE: {},
    CONNECT: {}
  }
}

/**
 * add().
 * @param {string} method.
 * @param {string} path.
 * @param {function} callback.
 */
Router.prototype.add = function (method, path, callback) {
  // define method
  if (typeof method !== 'string') {
    throw new TypeError('Method must be a string')
  }
  // define path
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string')
  }
  // define callback
  if (typeof callback !== 'function') {
    throw new TypeError('Callback must be a function')
  }
  // save new routes
  this.routes[method][path] = callback
}

/**
 * manage(req, res)
 * @param {object} req.
 * @param {object} res.
 */
Router.prototype.manage = function (req, res) {
  // set response default configs
  res.statusCode = this.options.statusCode
  res.setHeader('Content-Type', this.options.contentType)
  // set response default functions
  res.sendCode = (code) => _sendCode(res, code)
  res.send = (content) => _send(res, content)
  // set request default configs
  const queryInit = req.url.indexOf('?')
  req.path = queryInit >= 0 ? req.url.substr(0, queryInit) : req.url
  req.query = queryInit >= 0 ? querystring.parse(req.url.substr(queryInit + 1, req.url.length)) : {}
  // call correct callback
  const callback = this.routes[req.method][req.path]
  if (callback) {
    callback(req, res)
  } else {
    _sendCode(res, 404)
  }
}

/**
 * _sendCode(res, code)
 * @param {object} res.
 * @param {number} code.
 */
function _sendCode (res, code) {
  res.statusCode = code
  res.end()
}

/**
 * _send(res, content)
 * @param {object} res.
 * @param {*} content.
 */
function _send (res, content) {
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
