const Server = require('./index').Server
const BodyParser = require('./index').BodyParser

// Initialize server.
const server = new Server({
  port: process.env.PORT || 9000
}, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Server is running')
})

// Initialize body parser.
const bodyParser = new BodyParser({
  onError: (req, res, next) => {
    next()
  },
  customParser: (req, res, next) => {
    next()
  }
})

// Middlewares:

server.middleware((req, res, next) => bodyParser.middleware(req, res, next))

// Routes:

server.get('/', (req, res) => {
  res.send({ hello: 'world' })
})

server.post('/', (req, res) => {
  res.send({ hello: 'world' })
})
