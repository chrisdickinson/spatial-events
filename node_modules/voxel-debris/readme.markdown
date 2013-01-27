# voxel-debris

create and collect voxel debris from exploded voxels

# example

[View this example.](http://substack.net/projects/voxel-debris/).

``` js
var createEngine = require('voxel-engine')
var game = createEngine({
    generate: function(x, y, z) {
        if (x*x + y*y + z*z > 20*20) return 0;
        return Math.floor(Math.random() * 4) + 1;
    },
    texturePath: './',
    materials: [ 'dirt', 'grass', 'crate', 'brick' ]
});
game.appendTo('#container');

var explode = require('voxel-debris')(game, { power : 1.5 });

explode.on('collect', function (item) {
    console.log(game.materials[item.value - 1]);
});

game.on('mousedown', function (pos) {
    if (erase) explode(pos)
    else game.createBlock(pos, 1)
});

window.addEventListener('keydown', ctrlToggle);
window.addEventListener('keyup', ctrlToggle);

var erase = true
function ctrlToggle (ev) { erase = !ev.ctrlKey }
game.requestPointerLock('canvas');
```

# methods

``` js
var voxelDebris = require('voxel-debris')
```

## var explode = voxelDebris(game, opts)

Create an explosion function from a
[voxel-engine](http://npmjs.org/packages/voxel-engine)
instance and some options.

If `opts.limit(item)` is specified, when it returns true, `item` will not be
collected by the player when they pass within the collision radius.

If `opts.yield(value)` is specified, its return value will be how many debris
items are created for the voxel data `value`. `opts.yield` can be a function or
just a number.

`opts.expire.start` and `opts.expire.end` control how long debris should persist
in the game world in milliseconds. A timeout will be chosen uniformly randomly
between start and end.
When `opts.expire` is a number, its value will be used for both start and end.

`opts.power` influcences the velocity of the debris. Default value: 1.

## explode(pos)

Explode the block at the THREE.Vector3 position `pos` if the data at `pos` is
non-zero.

# events

## explode.on('collect', function (item) {})

When a debris item passes within the collision radius, the `'collect'` event
fires with the item object before being removed from the scene.

# install

With [npm](https://npmjs.org) do:

```
npm install voxel-debris
```

Then use [browserify](http://browserify.org) to `require('voxel-debris')`.

# license

MIT
