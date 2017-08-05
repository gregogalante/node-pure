# Node pure server

Experimental Node server without external dependencies.

## Usage

```javascript
const Server = require('./lib/Server')

const server = new Server({
  port: 80,
  router: {
    statusCode: 200, // default response status code
    contentType: 'text/plain' // default response content type
  }
})

// Add a middleware.
server.middle((req, res, next) => {
  next()
})

// Add get route.
server.get('/', (req, res) => {
  res.send({
    hello: 'world'
  })
})

// Add post route.
server.post('/', (req, res) => {
  res.send({
    hello: 'world'
  })
})
```

**Note: this is an experimental application and should not be used for production products.**