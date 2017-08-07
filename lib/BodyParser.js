/**
 * BodyParser
 *
 * options: {
 *  parseEverytime: {boolean} - false,
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
  // not parse if method is not accepted
  if (!this.options.parseEverytime && (req.method === 'GET' ||
                                       req.method === 'DELETE' ||
                                       req.method === 'HEAD')) {
    next()
    return
  }

  // case application/json content type
  if (req.headers['content-type'] && req.headers['content-type'].indexOf('application/json') > -1) {
    this._jsonParseMiddleware(req, res, next)
    return
  }

  next()
}

/**
 * _jsonParseMiddleware(req, res, next)
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
BodyParser.prototype._jsonParseMiddleware = function (req, res, next) {
  let body = ''

  // manage single chunk
  req.on('data', (chunk) => {
    body += chunk
  })

  // manage end of body
  req.on('end', () => {
    try {
      req.body = JSON.parse(body)
      next()
    } catch (error) {
      console.log(error)
      res.statusCode = 422
      res.end()
    }
  })
}

module.exports = BodyParser
