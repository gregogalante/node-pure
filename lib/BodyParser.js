/**
 * BodyParser
 */
const BodyParser = function (parseType = false) {
  if (!parseType) {
    this.parseType = 0 // dynamic
  }
}

/**
 * parse(req, res, next)
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
BodyParser.prototype.parse = function (req, res, next) {
  console.log(req.headers['content-type'])
  // TODO: Continue parse
  next()
}

module.exports = BodyParser
