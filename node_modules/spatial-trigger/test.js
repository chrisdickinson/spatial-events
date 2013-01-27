var trigger = require('./index')
  , aabb = require('aabb-3d')
  , SPEE = require('spatial-events')
  , test = require('tape')

test('trigger works as expected', function(assert) {
  var idx = 0, spee = new SPEE, enter, exit

  trigger(spee, aabb([0, 0, 0], [4, 4, 4]), 'point')
    .on('enter', function(idx) { enter = idx })
    .on('exit', function(idx) { exit = idx })

  spee.emit('point', [-4, -4, -4], idx++)
  spee.emit('point', [-2, -2, -2], idx++)
  spee.emit('point', [+0, +0, +0], idx++) // 'entered box'
  spee.emit('point', [+2, +2, +2], idx++)
  spee.emit('point', [+4, +4, +4], idx++) 
  spee.emit('point', [+6, +6, +6], idx++) // 'exited box'
  spee.emit('point', [+8, +8, +8], idx++)

  assert.equal(enter, 2)
  assert.equal(exit, 5)

  assert.end()
})
