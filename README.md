# Node pure server

Experimental Node server without external dependencies.

## Usage

```javascript
const Server = require('./lib/Server')

const server = new Server({
  port: 9000,
  router: {
    statusCode: 200, // default response status code
    contentType: 'text/plain' // default response content type
  }
})

server.get('/', (req, res) => {
  res.send({
    hello: 'world'
  })
})
```