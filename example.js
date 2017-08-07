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
const bodyParser = new BodyParser()

// Middlewares:

server.middleware((req, res, next) => bodyParser.middleware(req, res, next))

// Routes:

server.get('/', (req, res) => {
  res.send({ hello: 'world' })
})

server.post('/', (req, res) => {
  console.log(req.body)
  res.send({ hello: 'world' })
})
