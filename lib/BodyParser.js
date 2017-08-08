'use strict'

/**
 * BodyParser
 * @param {object} options
 *
 * options: {
 *  onError: {function} - (error, req, res, next)
 *  customParser: {function} - (req, res, next)
 * }
 */
const BodyParser = function (options = {}) {
  // define options
  if (typeof options !== 'object') {
    throw new TypeError('Options must be an object')
  }
  this.options = options
}

/**
 * middleware(req, res, next)
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
BodyParser.prototype.middleware = function (req, res, next) {
  // check request method needs parser
  if (req.method === 'GET' || req.method === 'DELETE' || req.method === 'HEAD') {
    next()
    return
  }

  // parse case application/json content type
  if (req.headers['content-type'] && req.headers['content-type'].indexOf('application/json') > -1) {
    this._jsonParse(req, res, next)
    return
  }

  // call custom parser if present
  if (this.options.customParser) {
    this.options.customParser(req, res, next)
    return
  }

  // avoid parser and continue
  next()
}

/**
 * jsonParse(content)
 * @param {string} content
 * @param {function} callback - (error, content)
 */
BodyParser.prototype.jsonParse = function (content, callback) {
  setImmediate(() => {
    try {
      callback(null, JSON.parse(content))
    } catch (error) {
      callback(error, null)
    }
  })
}

/**
 * _jsonParse(req, res, next)
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
BodyParser.prototype._jsonParse = function (req, res, next) {
  let body = ''

  // manage single chunk
  req.on('data', (chunk) => {
    body += chunk
  })

  // manage end of body
  req.on('end', () => {
    this.jsonParse(body, (error, data) => {
      if (error) {
        this._manageParseError(error, req, res, next)
        return
      }

      req.body = data
      next()
    })
  })
}

/**
 * _manageParseError(error, res)
 * @param {object} error
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
BodyParser.prototype._manageParseError = function (error, req, res, next) {
  if (this.options.onError) {
    this.options.onError(error, req, res, next)
  } else {
    res.statusCode = 422
    res.end()
  }
}

module.exports = BodyParser
