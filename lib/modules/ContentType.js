'use strict'

const path = require('path')

/**
 * @module ContentType
 */

/**
 * @function getContentType(filename)
 * @param {string} filename
 */
const getContentType = function (filename) {
  const extname = path.extname(filename)
  let contentType = 'text/html'

  switch (extname) {
    case '.js':
      contentType = 'text/javascript'
      break
    case '.css':
      contentType = 'text/css'
      break
    case '.json':
      contentType = 'application/json'
      break
    case '.png':
      contentType = 'image/png'
      break
    case '.jpg':
      contentType = 'image/jpg'
      break
    case '.wav':
      contentType = 'audio/wav'
      break
    case '.txt':
      contentType = 'text/plain'
      break
  }

  return contentType
}

module.exports = {
  getContentType
}
