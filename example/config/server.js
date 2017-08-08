const Server = require('../../index').Server

const server = new Server({
  port: process.env.PORT || 9000,
  https: false
}, (err) => {
  if (err) {
    console.log(err)
    return
  }

  console.log('Server is running')
})

module.exports = server
