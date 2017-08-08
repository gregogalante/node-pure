'use strict'

const BodyParser = require('../index').BodyParser

const bodyParser = new BodyParser()

test('Parse a JSON', () => {
  const json = { hello: 'world' }
  const string = JSON.stringify(json)
  // parse a json
  bodyParser.jsonParse(string, (err, data) => {
    expect(err).toBe(null)
    expect(typeof data).toBe('object')
    expect(data).toEqual(json)
  })
})
