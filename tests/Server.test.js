const Server = require('../index').Server

const server = new Server({
  port: 9000
})

test('Add GET path', () => {
  // define callback
  const callback = () => {}
  // add path
  server.get('/', callback)
  // check path
  expect(typeof server.routes.GET['/']).toBe(typeof callback)
  expect(server.routes.GET['/']).toBe(callback)
})

test('Add POST path', () => {
  // define callback
  const callback = () => {}
  // add path
  server.post('/', callback)
  // check path
  expect(typeof server.routes.POST['/']).toBe(typeof callback)
  expect(server.routes.POST['/']).toBe(callback)
})

test('Add PUT path', () => {
  // define callback
  const callback = () => {}
  // add path
  server.put('/', callback)
  // check path
  expect(typeof server.routes.PUT['/']).toBe(typeof callback)
  expect(server.routes.PUT['/']).toBe(callback)
})

test('Add DELETE path', () => {
  // define callback
  const callback = () => {}
  // add path
  server.delete('/', callback)
  // check path
  expect(typeof server.routes.DELETE['/']).toBe(typeof callback)
  expect(server.routes.DELETE['/']).toBe(callback)
})

test('Add a middleware', () => {
  // define middleware
  const middleware = () => {}
  // add path
  server.middleware(middleware)
  // check middlewares
  expect(server.middlewares.length).toBe(1)
  expect(typeof server.middlewares[0]).toBe(typeof middleware)
  expect(server.middlewares[0]).toBe(middleware)
})

server.close()
