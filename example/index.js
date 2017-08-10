const server = require('./config/server')
const logRequestMiddleware = require('../index').modules.Logger.logRequestMiddleware
const jsonParserMiddleware = require('../index').modules.BodyParser.jsonParserMiddleware

// Middlewares:

server.use(null, logRequestMiddleware)
server.use(null, jsonParserMiddleware)

// Routes:

server.get('/', null, (req, res) => {
  res.send({ hello: 'world' })
})

server.post('/', null, (req, res) => {
  res.send({ hello: 'world' })
})
