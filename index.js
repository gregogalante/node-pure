module.exports = {
  Server: require('./lib/Server'),

  modules: {
    Logger: require('./lib/modules/Logger'),
    BodyParser: require('./lib/modules/BodyParser'),
    ContentType: require('./lib/modules/ContentType')
  }
}
