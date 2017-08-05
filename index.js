const Server = require('./lib/Server')

const server = new Server({
  port: 9000
})

server.middle((req, res, next) => {
  next()
})

server.get('/', (req, res) => {
  res.send({
    hello: 'world'
  })
})

server.post('/', (req, res) => {
  res.send({
    hello: 'world'
  })
})
