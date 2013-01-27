module.exports = trigger

var EE = require('events').EventEmitter

var slice = [].slice
  , ALL

function trigger(spatial_ee, box, event_name) {
  // we do this dance so that we don't have to explicitly
  // require aabb-3d (so this'll work with aabb-2d too!)
  ALL = ALL || new box.constructor([-Infinity, -Infinity, -Infinity], [Infinity, Infinity, Infinity])

  var ee = new EE
    , is_inside = false
    , inside_in_turn = false

  event_name = event_name || 'position'

  spatial_ee
    .on(event_name, ALL, anywhere)
    .on(event_name, box, trigger_zone)

  return ee

  function trigger_zone() {
    inside_in_turn = true    
  }

  function anywhere() {
    if(inside_in_turn !== is_inside) {
      var args = slice.call(arguments)
      args.unshift(inside_in_turn ? 'enter' : 'exit')
      ee.emit.apply(ee, args)
    }
    is_inside = inside_in_turn
    inside_in_turn = false
  }
}
