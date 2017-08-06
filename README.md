# Node pure server

Experimental Node server without external dependencies.

## Usage

```javascript
const Server = require('node-pure-server')

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
  res.send({ hello: 'world' })
})
```

**Note: this is an experimental application and should not be used for production products.**