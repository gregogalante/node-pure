const schema = {}

const action = function (req, res) {
  res.send({hello: 'world'})
}

module.exports = {
  action,
  schema
}
