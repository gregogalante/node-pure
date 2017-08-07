const Server = require('./index').Server
const BodyParser = require('./index').BodyParser
const formidable = require('formidable')

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
  customParser: (req, res, next) => {
    const form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.sendStatus(422)
        return
      }

      req.body = fields
      next()
    })
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
