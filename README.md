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

server.middle((req, res, next) => {
  console.log('New request')
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
```

**Note: this is an experimental application and should not be used for production products.**