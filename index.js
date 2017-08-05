const Server = require('./lib/Server')

const server = new Server({
  port: 9000
})

server.get('/', (req, res) => {
  res.send({
    hello: 'world'
  })
})

server.post('/', (req, res) => {
  console.log(req.body)
  res.send({
    hello: 'world'
  })
})
