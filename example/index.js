const server = require('./config/server')
const logRequestMiddleware = require('../index').modules.Logger.logRequestMiddleware

// Middlewares:

server.use(logRequestMiddleware)

// Routes:

server.get('/', (req, res) => {
  res.send({ hello: 'world' })
})

server.post('/', (req, res) => {
  res.send({ hello: 'world' })
})
