# collide-3d-tilemap

an api for user-defined collision-detection between [aabb-3d](https://github.com/chrisdickinson/aabb-3d) objects and tilemaps.

```javascript

var my_tilemap = [
        0, 0, 0, 1
      , 1, 0, 0, 1
      , 1, 0, 0, 1
      , 1, 1, 1, 1
    ]

var collisions = require('collide-3d-tilemap')
  , collide

var player = aabb([0, 0, 0], [16, 16, 16])
  , vec = [0, 0, 0]

// collisions(field, size of tile in pixels, [width, height])
collide = collisions(my_tilemap, 32)

my_game_event_loop(function(dt) {
  vec = get_player_input() * dt 

  collide(player, vec, function(axis, tile_data, coords, dir, diff) {
    if(tile) {
      vec[axis] = diff
      return true
    }
  })

})

```

# License

MIT
