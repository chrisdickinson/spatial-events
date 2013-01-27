var S_EE = require('./index')
  , aabb = require('aabb-3d')
  , test = require('tape')

test('s-ee on/emit/remove works as expected', function(assert) {
  // test far apart listeners
  var s_ee = new S_EE
    , ev = 'data-'+Math.random()
    , triggered = []

  /*
             ^
             |  /
          D  | /  C
      <------+------->
        A H /|  B G
        E  / |  F
          /  V
  */


  s_ee.on(ev, aabb([-120, 120, -120], [3, 3, 3]), function() {
    triggered.push('A')
  })

  s_ee.on(ev, aabb([120, 120, -120], [3, 3, 3]), function() {
    triggered.push('B')
  })

  s_ee.on(ev, aabb([120, 120, 120], [3, 3, 3]), function() {
    triggered.push('C')
  })

  s_ee.on(ev, aabb([-120, 120, 120], [3, 3, 3]), function() {
    triggered.push('D')
  })

  s_ee.on(ev, aabb([-120, -120, -120], [3, 3, 3]), function() {
    triggered.push('E')
  })

  s_ee.on(ev, aabb([120, -120, -120], [3, 3, 3]), function() {
    triggered.push('F')
  })

  s_ee.on(ev, aabb([120, -120, 120], [3, 3, 3]), function() {
    triggered.push('G')
  })

  s_ee.on(ev, aabb([-120, -120, 120], [3, 3, 3]), function() {
    triggered.push('H')
  })

  s_ee.emit(ev, aabb([-121, 121, -121], [2, 2, 2]))
  assert.deepEqual(triggered, ['A'], 'only A'); triggered.length = 0

  s_ee.emit(ev, aabb([120, 120, -120], [2, 2, 2]))
  assert.deepEqual(triggered, ['B'], 'only B'); triggered.length = 0

  s_ee.emit(ev, aabb([120, 120, 120], [2, 2, 2]))
  assert.deepEqual(triggered, ['C'], 'only C'); triggered.length = 0

  s_ee.emit(ev, aabb([-120, 120, 120], [2, 2, 2]))
  assert.deepEqual(triggered, ['D'], 'only D'); triggered.length = 0

  s_ee.emit(ev, aabb([-120, -120, -120], [2, 2, 2]))
  assert.deepEqual(triggered, ['E'], 'only E'); triggered.length = 0

  s_ee.emit(ev, aabb([120, -120, -120], [2, 2, 2]))
  assert.deepEqual(triggered, ['F'], 'only F'); triggered.length = 0

  s_ee.emit(ev, aabb([120, -120, 120], [2, 2, 2]))
  assert.deepEqual(triggered, ['G'], 'only G'); triggered.length = 0

  s_ee.emit(ev, aabb([-120, -120, 120], [2, 2, 2]))
  assert.deepEqual(triggered, ['H'], 'only H'); triggered.length = 0

  s_ee.emit(ev, aabb([-200, 0, -200], [200, 200, 400]))
  assert.deepEqual(triggered, ['A', 'D'], 'A D'); triggered.length = 0

  s_ee.emit(ev, aabb([-200, -200, -200], [200, 200, 400]))
  assert.deepEqual(triggered, ['E', 'H'], 'E H'); triggered.length = 0

  s_ee.emit(ev, aabb([-200, -200, -200], [400, 400, 200]))
  assert.deepEqual(triggered, ['A', 'B', 'E', 'F'], 'A B E F'); triggered.length = 0

  s_ee.emit(ev, aabb([-200, -200, -200], [200, 400, 400]))
  assert.deepEqual(triggered, ['A', 'D', 'E', 'H'], 'A D E H'); triggered.length = 0

  s_ee.emit(ev, aabb([-200, -200, 0], [400, 400, 200]))
  assert.deepEqual(triggered, ['C', 'D', 'G', 'H'], 'C D G H'); triggered.length = 0

  s_ee.emit(ev, aabb([0, -200, -200], [200, 400, 400]))
  assert.deepEqual(triggered, ['B', 'C', 'F', 'G'], 'B C F G'); triggered.length = 0

  s_ee.emit(ev, aabb([-200, 0, -200], [400, 200, 400]))
  assert.deepEqual(triggered, ['A', 'B', 'C', 'D'], 'A B C D'); triggered.length = 0

  s_ee.emit(ev, aabb([-200, -200, -200], [400, 200, 400]))
  assert.deepEqual(triggered, ['E', 'F', 'G', 'H'], 'E F G H'); triggered.length = 0



  // test overlapping listener + small listener
  var rem
  s_ee.on(ev, aabb([-200, -200, -200], [400, 400, 400]), rem = function() {
    triggered.push('O')
  })

  s_ee.emit(ev, aabb([-200, -200, -200], [200, 400, 400]))
  assert.deepEqual(triggered, ['A', 'D', 'E', 'H', 'O'], 'overlap A D E H O'); triggered.length = 0

  s_ee.emit(ev, aabb([-121, 121, -121], [2, 2, 2]))
  assert.deepEqual(triggered, ['A', 'O'], 'A, then O'); triggered.length = 0

  s_ee.remove(ev, rem)

  s_ee.emit(ev, aabb([-200, -200, -200], [200, 400, 400]))
  assert.deepEqual(triggered, ['A', 'D', 'E', 'H'], 'overlap A D E H -- O was removed'); triggered.length = 0

  // test infinite listener

  s_ee.on(ev, aabb([0, 0, 0], [Infinity, Infinity, Infinity]), rem = function() {
    triggered.push('+I')
  })

  s_ee.emit(ev, aabb([400, 4000, 9999900], [200, 400, 400]))
  assert.deepEqual(triggered, ['+I'], '+I'); triggered.length = 0

  s_ee.emit(ev, aabb([400, 4000, -9999900], [200, 400, 400]))
  assert.deepEqual(triggered, [], 'none'); triggered.length = 0

  s_ee.on(ev, aabb([-Infinity, -Infinity, -Infinity], [Infinity, Infinity, Infinity]), function() {
    triggered.push('I')
  })

  s_ee.emit(ev, aabb([400, 4000, 9999900], [200, 400, 400]))
  assert.deepEqual(triggered, ['+I', 'I'], '+I I'); triggered.length = 0

  s_ee.remove(ev, rem)

  s_ee.emit(ev, aabb([400, 4000, 9999900], [200, 400, 400]))
  assert.deepEqual(triggered, ['I'], 'I'); triggered.length = 0

  // test infinite event

  s_ee.emit(ev, aabb([-Infinity, -Infinity, -Infinity], [Infinity, Infinity, Infinity]))
  assert.deepEqual(triggered, ["A","B","C","D","E","F","G","H","I"], 'all'); triggered.length = 0


  // test point event

  s_ee.emit(ev, [0, 0, 0])
  assert.deepEqual(triggered, ["I"], 'point event I'); triggered.length = 0

  s_ee.emit(ev, [-120, -120, -120])
  assert.deepEqual(triggered, ["E", "I"], 'point event E I'); triggered.length = 0

  assert.end()
})

