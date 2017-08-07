const server = require('./config/server')

/**
 * Routes:
 */
server.get('/', (req, res) => { res.end() })
