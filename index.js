module.exports = SpatialEventEmitter

var slice = [].slice
  , Tree = require('./tree')
  , aabb = require('aabb-3d')

function SpatialEventEmitter() {
  this.root = null
  this.infinites = {}
}

var cons = SpatialEventEmitter
  , proto = cons.prototype

proto.size = 16

proto.addListener = 
proto.addEventListener = 
proto.on = function(event, bbox, listener) {
  if(!finite(bbox)) {
    (this.infinites[event] = this.infinites[event] || []).push({
      bbox: bbox
    , func: listener
    })
    return this
  }

  (this.root = this.root || this.create_root(bbox))
    .add(event, bbox, listener)

  return this
}

proto.once = function(event, bbox, listener) {
  var self = this

  self.on(event, bbox, function once() {
    listener.apply(null, arguments)
    self.remove(event, once)
  })

  return self
}

proto.removeListener =
proto.removeEventListener =
proto.remove = function(event, listener) {
  if(this.root) {
    this.root.remove(event, listener)
  }

  if(!this.infinites[event]) {
    return this
  }

  for(var i = 0, len = this.infinites[event].length; i < len; ++i) {
    if(this.infinites[event][i].func === listener) {
      break
    }
  }

  if(i !== len) {
    this.infinites[event].splice(i, 1)
  }

  return this
}

proto.emit = function(event, bbox/*, ...args */) {
  var args = slice.call(arguments, 2)

  // support point emitting
  if('0' in bbox) {
    bbox = aabb(bbox, [0, 0, 0]) 
  }

  if(this.root) {
    this.root.send(event, bbox, args)
  }

  if(!this.infinites[event]) {
    return this
  }

  var list = this.infinites[event].slice()
  for(var i = 0, len = list.length; i < len; ++i) {
    if(list[i].bbox.intersects(bbox)) {
      list[i].func.apply(null, args) 
    }
  }

  return this
}

proto.rootSize = function(size) {
  proto.size = size
}

proto.create_root = function(bbox) {
  var self = this
    , size = self.size
    , base = [
        Math.floor(bbox.x0() / size) * size
      , Math.floor(bbox.y0() / size) * size
      , Math.floor(bbox.z0() / size) * size
      ]
    , tree_bbox = new bbox.constructor(base, [size, size, size])

  function OurTree(size, bbox) {
    Tree.call(this, size, bbox, null)
  }

  OurTree.prototype = Object.create(Tree.prototype)
  OurTree.prototype.constructor = OurTree
  OurTree.prototype.grow = function(new_root) {
    self.root = new_root
  }
  OurTree.prototype.min_size = size

  return new OurTree(size, tree_bbox) 
}

function finite(bbox) {
  return isFinite(bbox.x0()) &&
         isFinite(bbox.x1()) &&
         isFinite(bbox.y0()) &&
         isFinite(bbox.y1()) &&
         isFinite(bbox.z0()) &&
         isFinite(bbox.z1())
}
