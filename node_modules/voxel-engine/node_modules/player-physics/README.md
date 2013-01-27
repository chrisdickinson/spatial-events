# player-physics

an attempt at first person shooter physics for three.js. based originally on `PointerLockControls.js` from @mrdoob in three.js but heavily modified

works in the client or on the server. use [browserify](http://browserify.org) for client side usage

built for [voxeljs](http://voxeljs.com) and used in [voxel-engine](https://github.com/maxogden/voxel-engine)

## install

`npm install player-physics`

## example

```javascript
var playerPhysics = require('player-physics')
var player = playerPhysics()
player.enabled = true
player.moveForward = true
player.tick(200) // milliseconds since last tick
console.log(player.velocity)
```

using the streaming api with the [interact](https://github.com/chrisdickinson/interact) module (for pointerlock):

```javascript
var interact = require('interact')
var pointer = interact()
pointer.on('attain', function(movements) {
  player.enabled = true
  movements.pipe(player)
})
pointer.request()
```

## license

BSD
