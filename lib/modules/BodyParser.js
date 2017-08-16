'use strict'

/**
 * @module BodyParser
 */

/**
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
const jsonParserMiddleware = function (req, res, next) {
  let body = ''

  if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'PATCH') {
    next()
    return
  }

  req.on('data', (chunk) => {
    body += chunk
  })

  req.on('end', () => {
    if (body === '') {
      next()
    }
    try {
      req.body = JSON.parse(body)
      next()
    } catch (err) {
      _resParserError(res)
    }
  })
}

/**
 * @function _resParserError(res)
 * @param {object} res
 */
const _resParserError = function (res) {
  res.statusCode = 422
  res.end()
}

module.exports = {
  jsonParserMiddleware
}
