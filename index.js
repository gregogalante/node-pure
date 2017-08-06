const Server = require('./lib/Server')

const server = new Server({
  port: process.env.PORT || 9000
}, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Server is running')
})

server.middleware((req, res, next) => {
  next()
})

server.get('/', (req, res) => {
  res.send({ hello: 'world' })
})

server.post('/', (req, res) => {
  console.log(req.body)
  res.send({ hello: 'world' })
})
