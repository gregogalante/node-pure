'use strict'

const Server = require('../index').Server

const server = new Server({
  port: 9000
})

test('Add GET path', () => {
  // define callback
  const callback = () => {}
  // add path
  server.get('/', null, callback)
  // check path
  expect(typeof server.routes.GET['/']).toBe('object')
})

test('Add DELETE path', () => {
  // define callback
  const callback = () => {}
  // add path
  server.delete('/', null, callback)
  // check path
  expect(typeof server.routes.DELETE['/']).toBe('object')
})

test('Add HEAD path', () => {
  // define callback
  const callback = () => {}
  // add path
  server.head('/', null, callback)
  // check path
  expect(typeof server.routes.HEAD['/']).toBe('object')
})

test('Add POST path', () => {
  // define callback
  const callback = () => {}
  // add path
  server.post('/', null, callback)
  // check path
  expect(typeof server.routes.POST['/']).toBe('object')
})

test('Add PUT path', () => {
  // define callback
  const callback = () => {}
  // add path
  server.put('/', null, callback)
  // check path
  expect(typeof server.routes.PUT['/']).toBe('object')
})

test('Add PATCH path', () => {
  // define callback
  const callback = () => {}
  // add path
  server.patch('/', null, callback)
  // check path
  expect(typeof server.routes.PATCH['/']).toBe('object')
})

test('Add a middleware', () => {
  // define middleware
  const middleware = () => {}
  // add path
  server.use(null, middleware)
  // check middlewares
  expect(server.middlewares.length).toBe(1)
})

server.close()
