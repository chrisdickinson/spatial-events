module.exports = DOMStream

var Stream = require('stream').Stream

function DOMStream(el, mode, mimetype) {
  this.el = el
  this.mode = mode
  this.mimetype = mimetype || 'text/html'

  Stream.call(this)
}

var cons = DOMStream
  , proto = cons.prototype = new Stream

proto.constructor = cons

cons.APPEND = 0
cons.WRITE = 1

proto.writable = true

proto.setMimetype = function(mime) {
  this.mimetype = mime
}

proto.write = function(data) {
  var result = (this.mode === cons.APPEND) ? this.append(data) : this.insert(data)
  this.emit('data', this.el.childNodes)
  return result
}

proto.insert = function(data) {
  this.el.innerHTML = ''
  return this.append(data)
}

proto.append = function(data) {
  var result = this[this.resolveMimetypeHandler()](data)

  for(var i = 0, len = result.length; i < len; ++i) {
    this.el.appendChild(result[i])
  }

  return true
}

proto.resolveMimetypeHandler = function() {
  var type = this.mimetype.replace(/(\/\w)/, function(x) {
    return x.slice(1).toUpperCase()
  })
  type = type.charAt(0).toUpperCase() + type.slice(1)

  return 'construct'+type
}

proto.constructTextHtml = function(data) {
  var isTableFragment = /(tr|td|th)/.test(data) && !/table/.test(data)
    , div

  if(isTableFragment) {
    // wuh-oh.
    div = document.createElement('table')
  }

  div = div || document.createElement('div')
  div.innerHTML = data 

  return [].slice.call(div.childNodes)
}

proto.constructTextPlain = function(data) {
  var textNode = document.createTextNode(data)

  return [textNode]
}
