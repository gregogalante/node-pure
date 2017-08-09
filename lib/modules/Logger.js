/**
 * @module Logger
 */

/**
 * @function logRequestMiddleware
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
const logRequestMiddleware = function (req, res, next) {
  setImmediate(() => {
    const reqInfo = `[${Date.now()}] - ${req.method} - ${req.url}`
    console.info(reqInfo)
  })

  next()
}

module.exports = {
  logRequestMiddleware
}
