var WriteStream = require('./writable')
  , ReadStream = require('./readable')
  , DOMStream = {}

DOMStream.WriteStream = WriteStream
DOMStream.ReadStream = ReadStream

DOMStream.createAppendStream = function(el, mimetype) {
  return new DOMStream.WriteStream(
      el
    , DOMStream.WriteStream.APPEND
    , mimetype
  )
}

DOMStream.createWriteStream = function(el, mimetype) {
  return new DOMStream.WriteStream(
      el
    , DOMStream.WriteStream.WRITE
    , mimetype
  )
}

DOMStream.createReadStream =
DOMStream.createEventStream = function(el, type, preventDefault) {
  preventDefault = preventDefault === undefined ? true : preventDefault

  return new DOMStream.ReadStream(
      el
    , type
    , preventDefault
  )
}

module.exports = DOMStream

