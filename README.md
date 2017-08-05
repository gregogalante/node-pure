# Node pure server

Experimental Node server without external dependencies.

## Usage


```javascript
const Server = require('./lib/Server')

const server = new Server({
  port: 9000
})

server.get('/', (req, res) => {
  res.send({
    hello: 'world'
  })
})
```