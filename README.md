# spatial-events

a spatially-aware event emitter, designed to work in 3d space with [axis aligned bounding boxes](https://github.com/chrisdickinson/aabb-3d).

listeners may be attached with a name *and* a bounding box, and events may be emitted
with a name, bounding box or point, and arguments.

```javascript

var spatial = require('spatial-events')
  , aabb = require('aabb-3d')

var ee = new spatial

ee.on('explosion', aabb([0, 0, 0], [40, 40, 40]), function(arg) {
  console.log('an explosion happened and it was '+arg)
})

ee.emit('explosion', [20, 20, 20], 'overrated')

ee.emit('explosion', aabb([-Infinity, -Infinity, -Infinity], [Infinity, Infinity, Infinity]), 'without measure')

ee.emit('explosion', aabb([-20, -20, -20], [10, 10, 10]), 'never heard')

```

The event emitter creates an Octree under the covers, which exponentially increases
the size of its coordinate system to fit bounding box listeners that are added.

Infinite listeners are stored in a separate structure.

In practice, this means that any "large" listener will be fired after any "small" listener,
generally speaking -- events bubble up.

# license

MIT
