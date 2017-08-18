'use strict'

const http = require('http')
const https = require('https')
const url = require('url')
const fs = require('fs')
const querystring = require('querystring')

const ContentType = require('./modules/ContentType')

/**
 * @class Server
 * @param {object} options
 * @param {number} options.port
 * @param {string} options.public
 * @param {object} options.https
 * @param {function} options.schemaValidator
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
 * @param {function} callback
 */
Server.prototype.close = function (callback = () => {}) {
  // check parameters
  this._checkCloseParameters(callback)

  // close connection
  this.connection.close(callback)
}

/**
 * @param {string} path
 * @param {object} schema
 * @param {function} callback
 */
Server.prototype.get = function (path, schema, callback) {
  // check parameters
  this._checkRouteParameters(path, schema, callback)

  // save route
  this.routes.GET[path] = {
    schema: schema,
    callback: callback
  }
}

/**
 * @param {string} path
 * @param {object} schema
 * @param {function} callback
 */
Server.prototype.delete = function (path, schema, callback) {
  // check parameters
  this._checkRouteParameters(path, schema, callback)

  // save route
  this.routes.DELETE[path] = {
    schema: schema,
    callback: callback
  }
}

/**
 * @param {string} path
 * @param {object} schema
 * @param {function} callback
 */
Server.prototype.head = function (path, schema, callback) {
  // check parameters
  this._checkRouteParameters(path, schema, callback)

  // save route
  this.routes.HEAD[path] = {
    schema: schema,
    callback: callback
  }
}

/**
 * @param {string} path
 * @param {object} schema
 * @param {function} callback
 */
Server.prototype.post = function (path, schema, callback) {
  // check parameters
  this._checkRouteParameters(path, schema, callback)

  // save route
  this.routes.POST[path] = {
    schema: schema,
    callback: callback
  }
}

/**
 * @param {string} path
 * @param {object} schema
 * @param {function} callback
 */
Server.prototype.put = function (path, schema, callback) {
  // check parameters
  this._checkRouteParameters(path, schema, callback)

  // save route
  this.routes.PUT[path] = {
    schema: schema,
    callback: callback
  }
}

/**
 * @param {string} path
 * @param {object} schema
 * @param {function} callback
 */
Server.prototype.patch = function (path, schema, callback) {
  // check parameters
  this._checkRouteParameters(path, schema, callback)

  // save route
  this.routes.PATCH[path] = {
    schema: schema,
    callback: callback
  }
}

/**
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

// Request managements
// ////////////////////////////////////////////////////////////////////

/**
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
    res.sendFile = (filePath, statusCode = 200) => this._sendFile(res, filePath, statusCode)
    res.sendStatus = (statusCode = 200) => this._sendStatus(res, statusCode)

    // find route
    let route = this.routes[req.method][req.path]
    if (!route && this.options.public) {
      route = this._generatePublicResourceRoute(req)
    }

    // return 404 if callrouteback is not present
    if (!route) {
      this._sendStatus(res, 404)
      return
    }

    // validate route schema
    let permitExecution = false
    if (this.options.schemaValidator && route.schema) {
      permitExecution = this.options.schemaValidator(req, route.schema)
    } else {
      permitExecution = true
    }

    // call middleware and route callback
    if (permitExecution) {
      setImmediate(() => this._manageMiddlewares(req, res, route.callback))
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    this._sendStatus(res, 500)
  }
}

/**
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
 * @param {object} req
 */
Server.prototype._generatePublicResourceRoute = function (req) {
  // find file path and file content type
  const filePath = `${this.options.public}${req.path}`
  // return route
  return {
    schema: null,
    callback: (req, res) => {
      res.sendFile(filePath)
    }
  }
}

// Response helpers
// ////////////////////////////////////////////////////////////////////

/**
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
 * @param {object} res
 * @param {string} filePath
 * @param {number} statusCode
 */
Server.prototype._sendFile = function (res, filePath, statusCode = 200) {
  const contentType = ContentType.getContentType(filePath)
  // read file and send it
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.statusCode = 404
      } else {
        res.statusCode = 500
      }
      res.end()
    } else {
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(content, 'utf-8')
    }
  })
}

/**
 * @param {object} res
 * @param {number} statusCode
 */
Server.prototype._sendStatus = function (res, statusCode = 200) {
  // set response status code
  res.statusCode = statusCode
  res.end()
}

// Check parameters
// ////////////////////////////////////////////////////////////////////

/**
 * @param {string} path
 * @param {object} schema
 * @param {function} callback
 */
Server.prototype._checkRouteParameters = function (path, schema, callback) {
  // check path
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string')
  }

  // check schema
  if (schema && typeof schema !== 'object') {
    throw new TypeError('Schema must be an object on null')
  }

  // check callback
  if (typeof callback !== 'function') {
    throw new TypeError('Callback must be a function')
  }
}

/**
 * @param {function} middleware
 */
Server.prototype._checkMiddlewareParameters = function (path, middleware) {
  // check path
  if (path && typeof path !== 'string') {
    throw new TypeError('Path must be a string or null')
  }

  // check middleware
  if (typeof middleware !== 'function') {
    throw new TypeError('Middleware must be a function')
  }
}

/**
 * @param {function} callback
 */
Server.prototype._checkCloseParameters = function (callback) {
  // check middleware
  if (typeof callback !== 'function') {
    throw new TypeError('Callback must be a function')
  }
}

module.exports = Server
