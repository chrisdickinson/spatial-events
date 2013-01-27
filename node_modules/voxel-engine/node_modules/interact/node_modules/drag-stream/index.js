module.exports = dragstream

var Stream = require('stream')
  , read = require('domnode-dom').createReadStream
  , through = require('through')

function dragstream(el) {
  var body = el.ownerDocument.body
    , down = read(el, 'mousedown')
    , up = read(body, 'mouseup', false)
    , move = read(body, 'mousemove', false)
    , anchor = {x: 0, y: 0, t: 0}
    , drag = through(on_move)

  // default to "paused"
  drag.pause()

  down.on('data', on_down)
  up.on('data', on_up)

  return move.pipe(drag)

  // listeners:

  function on_move(ev) {
    if(drag.paused) return

    drag.emit('data', datum(
        ev.screenX - anchor.x
      , ev.screenY - anchor.y
      , +new Date
    ))

    anchor.x = ev.screenX
    anchor.y = ev.screenY
  }

  function on_down(ev) {
    anchor.x = ev.screenX
    anchor.y = ev.screenY
    anchor.t = +new Date
    drag.resume()
    drag.emit('data', datum(
        anchor.x
      , anchor.y
      , anchor.t
    ))
  }

  function on_up(ev) {
    drag.pause()
    drag.emit('data', datum(
        ev.screenX - anchor.x
      , ev.screenY - anchor.y
      , +new Date
    ))
  }

  function datum(dx, dy, when) {
    return {
      dx: dx
    , dy: dy
    , dt: when - anchor.t
    }
  }
}
