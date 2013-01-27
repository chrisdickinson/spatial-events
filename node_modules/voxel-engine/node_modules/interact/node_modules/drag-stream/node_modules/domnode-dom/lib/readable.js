module.exports = DOMStream

var Stream = require('stream').Stream

var listener = function(el, type, onmsg) {
  return el.addEventListener(type, onmsg, false)
}

if(typeof $ !== 'undefined')
  listener = function(el, type, onmsg) {
    return el = $(el)[type](onmsg)
  }

if(typeof document !== 'undefined' && !document.createElement('div').addEventListener)
  listener = function(el, type, onmsg) {
    return el.attachEvent('on'+type, onmsg)
  }

function DOMStream(el, eventType, shouldPreventDefault) {
  this.el = el
  this.eventType = eventType
  this.shouldPreventDefault = shouldPreventDefault

  var self = this

  if(el && this.eventType)
    listener(
        this.el
      , this.eventType
      , function() { return self.listen.apply(self, arguments) }
    )

  Stream.call(this)
}

var cons = DOMStream
  , proto = cons.prototype = new Stream

proto.constructor = cons

proto.listen = function(ev) { 
  if(this.shouldPreventDefault)
    ev.preventDefault ? ev.preventDefault() : (ev.returnValue = false)

  var collectData = 
    this.eventType === 'submit' ||
    this.eventType === 'change' ||
    this.eventType === 'keydown' ||
    this.eventType === 'keyup' ||
    this.eventType === 'input'

  if(collectData) {
    if(this.el.tagName.toUpperCase() === 'FORM')
      return this.handleFormSubmit(ev)

    return this.emit('data', valueFromElement(this.el))
  }

  this.emit('data', ev) 
}

proto.handleFormSubmit = function(ev) {
  var elements = []

  if(this.el.querySelectorAll) {
    elements = this.el.querySelectorAll('input,textarea,select')
  } else {
    var inputs = {'INPUT':true, 'TEXTAREA':true, 'SELECT':true}

    var recurse = function(el) {
      for(var i = 0, len = el.childNodes.length; i < len; ++i) {
        if(el.childNodes[i].tagName) {
          if(inputs[el.childNodes[i].tagName.toUpperCase()]) {
            elements.push(el)
          } else {
            recurse(el.childNodes[i])
          }
        }
      }
    }

    recurse(this.el)
  }

  var output = {}
    , attr
    , val

  for(var i = 0, len = elements.length; i < len; ++i) {
    attr = elements[i].getAttribute('name')
    val = valueFromElement(elements[i])

    output[attr] = val
  }

  return this.emit('data', output)
}

function valueFromElement(el) {
  switch(el.getAttribute('type')) {
    case 'radio':
      return el.checked ? el.value : null
    case 'checkbox':
      return 'data', el.checked
  }
  return el.value
}
