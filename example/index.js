const server = require('./config/server')
const logRequestMiddleware = require('../index').modules.Logger.logRequestMiddleware
const jsonParserMiddleware = require('../index').modules.BodyParser.jsonParserMiddleware

const rootAction = require('./actions/rootAction')

// Middlewares:

server.use(null, logRequestMiddleware)
server.use(null, jsonParserMiddleware)

// Routes:

server.get('/', rootAction.schema, rootAction.action)