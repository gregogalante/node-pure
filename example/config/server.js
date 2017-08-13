const path = require('path')

const Server = require('../../index').Server

const settings = {

  // server port
  port: process.env.PORT || 9000,

  // server public directory
  public: path.resolve(__dirname, '../public'),

  // server https settings
  https: false,

  // schema validator for requests
  schemaValidator: (req) => {
    return true
  }

}

const server = new Server(settings, (err) => {
  if (err) {
    console.log(err)
    return
  }

  console.log('Server is running')
})

module.exports = server
