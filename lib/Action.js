/**
 * Action
 */
const Action = function (validator) {
  this.validator = validator
}

/**
 * call
 */
Action.prototype.call = function (req, res) {
  res.end()
}

module.exports = Action
