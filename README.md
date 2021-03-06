# Node pure

Experimental Node server without external dependencies.

## Usage

```javascript
const Server = require('pure').Server

const settings = {

  // server port
  port: process.env.PORT || 9000,

  // server public directory
  public: path.resolve(__dirname, './public'),

  // server https settings
  https: false,

  // schema validator for requests
  schemaValidator: (req, schema) => {
    return true
  }

}

// Initialize server.
const server = new Server(settings, (err) => {
  console.log('Server is running')
})

// Set middlewares.
server.middleware(null, (req, res, next) => { next() })
server.middleware('/admin', (req, res, next) => { next() })

// Set GET route.
server.get('/', null, (req, res) => {
  res.send({ hello: 'world' })
})

// Set POST route.
const postSchema = {
  properties: {
    example: { type: 'number' }
  }
}

server.post('/', postSchema, (req, res) => {
  res.send({ hello: 'world' })
})
```

**Note: this is an experimental application and should not be used for production products.**