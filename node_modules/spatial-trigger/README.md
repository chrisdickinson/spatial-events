# spatial-trigger

given a [spatial event emitter](https://github.com/chrisdickinson/spatial-events) and an
[axis aligned bounding box](https://github.com/chrisdickinson/aabb-3d), return a new event
emitter that emits `enter` and `exit` events when spatial events indicate that something
has passed into the bounding box.

```javascript

var trigger = require('spatial-trigger')
  , aabb = require('aabb-3d')
  , SPEE = require('spatial-events')
  , spee = new SPEE

trigger(spee, aabb([0, 0, 0], [4, 4, 4]), 'point')
  .on('enter', function() { console.log('entered box') })
  .on('exit', function() { console.log('exited box') })

spee.emit('point', [-4, -4, -4])
spee.emit('point', [-2, -2, -2])
spee.emit('point', [+0, +0, +0]) // 'entered box'
spee.emit('point', [+2, +2, +2])
spee.emit('point', [+4, +4, +4])
spee.emit('point', [+6, +6, +6]) // 'exited box'

```

## API

#### ee = trigger(spatial_ee, boundingBox[, eventName='position'])

attaches one infinite listener to `spatial_ee` and one at `boundingBox` for
`eventName` (which defaults to `'position'` if not given), and returns an event
emitter that emits `'enter'` and `'exit'` events. 

## Events

#### enter

`enter` events happen whenever the positions emitted by `spatial_ee` cross into
the given bounding box. When an event triggers the `enter` event, its arguments
will be forwarded to `enter` listeners. 

#### exit

`exit` events happen whenever the positions emitted by `spatial_ee` leave
the given bounding box. When an event triggers the `exit` event, its arguments
will be forwarded to `exit` listeners. 

## License

MIT

