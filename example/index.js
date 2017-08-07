const server = require('./config/server')

/**
 * Require actions:
 */
const homeAction = require('./app/actions/homeAction')

/**
 * Routes:
 */
server.get('/', homeAction.call)
