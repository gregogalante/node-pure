const logger = require('./config/logger')
const server = require('./config/server')

// Middlewares:

server.middleware((req, res, next) => logger.middleware(req, res, next))

// Routes:

server.get('/', (req, res) => {
  res.send({ hello: 'world' })
})

server.post('/', (req, res) => {
  res.send({ hello: 'world' })
})
