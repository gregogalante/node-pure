const path = require('path')

const Server = require('../index').Server
const BodyParser = require('../index').BodyParser
const Debugger = require('../index').Debugger

// Initialize server.
const server = new Server({
  port: process.env.PORT || 9000,
  https: false
}, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Server is running')
})

// Initialize bodyParser.
const bodyParser = new BodyParser({
  onError: (req, res, next) => {
    next()
  },
  customParser: (req, res, next) => {
    next()
  }
})

// Initialize myDebugger.
const myDebugger = new Debugger({
  consoleLog: true,
  writeLog: true,
  logOutPath: `${path.dirname(require.main.filename)}/log/log_out.log`,
  logErrPath: `${path.dirname(require.main.filename)}/log/log_out.log`
})

// Middlewares:

server.middleware((req, res, next) => myDebugger.middleware(req, res, next))
server.middleware((req, res, next) => bodyParser.middleware(req, res, next))

// Routes:

server.get('/', (req, res) => {
  res.send({ hello: 'world' })
})

server.post('/', (req, res) => {
  res.send({ hello: 'world' })
})
