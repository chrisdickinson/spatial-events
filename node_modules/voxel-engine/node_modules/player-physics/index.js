var THREE = require('three')
var inherits = require('inherits')
var stream = require('stream')

var PI_2 = Math.PI / 2

/**
 * based on PointerLockControls by mrdoob / http://mrdoob.com/
 * converted to a module + stream by @maxogden and @substack
 */

module.exports = function(camera, opts) {
  return new PlayerPhysics(camera, opts)
}

module.exports.PlayerPhysics = PlayerPhysics

function PlayerPhysics(camera, opts) {
  if (!(this instanceof PlayerPhysics)) return new PlayerPhysics(camera, opts)
  var self = this
  if (!opts) opts = {}
  
  
  this.readable = true
  this.writable = true
  this.enabled = false
  
  this.speed = {
    jump: (opts.jump || 3.25),
    move: (opts.move || 0.2),
    fall: (opts.fall || 0.3),
  }
  
  this.jumpTime = 250
  this.jumpRemaining = 0

  this.pitchObject = opts.pitchObject || new THREE.Object3D()
  if (camera) this.pitchObject.add( camera )

  this.yawObject = opts.yawObject || new THREE.Object3D()
  this.yawObject.position.y = 10
  this.yawObject.add( this.pitchObject )

  this.moveForward = false
  this.moveBackward = false
  this.moveLeft = false
  this.moveRight = false

  this.freedom = {
    'x+': true,
    'x-': true,
    'y+': true,
    'y-': true,
    'z+': true,
    'z-': true
  }
  
  this.wantsJump = false
  this.gravityEnabled = true
  
  this.velocity = opts.velocityObject || new THREE.Vector3()

  this.on('command', function(command, setting) {
    self[command] = setting
  })  
}

inherits(PlayerPhysics, stream.Stream)

PlayerPhysics.prototype.playerIsMoving = function() { 
  var v = this.velocity
  if (Math.abs(v.x) > 0.1 || Math.abs(v.y) > 0.1 || Math.abs(v.z) > 0.1) return true
  return false
}

PlayerPhysics.prototype.write = function(data) {
  if (this.enabled === false) return
  this.applyRotationDeltas(data)
}

PlayerPhysics.prototype.end = function() {
  this.emit('end')
}

PlayerPhysics.prototype.applyRotationDeltas = function(deltas) {
  this.yawObject.rotation.y -= deltas.dx * 0.002
  this.pitchObject.rotation.x -= deltas.dy * 0.002
  this.pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, this.pitchObject.rotation.x))
}

PlayerPhysics.prototype.tick = function (delta, cb) {
  if (this.enabled === false) return

  delta *= 0.1

  this.velocity.x += (-this.velocity.x) * 0.08 * delta
  this.velocity.z += (-this.velocity.z) * 0.08 * delta

  if (this.freedom['y-']) this.wantsJump = false
  if (this.wantsJump && this.jumpRemaining <= 0) this.jumpRemaining = this.jumpTime
  if (this.jumpRemaining > 0) this.jumpRemaining -= delta * 100
  if (this.jumpRemaining > 0) {
    this.velocity.y += this.speed.jump * delta
  } else {
    this.jumpRemaining = 0
    if (this.gravityEnabled) this.velocity.y -= this.speed.fall * delta
  }

  if (this.moveForward) this.velocity.z -= this.speed.move * delta
  if (this.moveBackward) this.velocity.z += this.speed.move * delta

  if (this.moveLeft) this.velocity.x -= this.speed.move * delta
  if (this.moveRight) this.velocity.x += this.speed.move * delta
  
  if (!this.freedom['x-']) this.velocity.x = Math.max(0, this.velocity.x)
  if (!this.freedom['x+']) this.velocity.x = Math.min(0, this.velocity.x)
  if (!this.freedom['y-']) this.velocity.y = Math.max(-0.0001, this.velocity.y)
  if (!this.freedom['y+']) this.velocity.y = Math.min(0, this.velocity.y)
  if (!this.freedom['z-']) this.velocity.z = Math.max(0, this.velocity.z)
  if (!this.freedom['z+']) this.velocity.z = Math.min(0, this.velocity.z)
  
  if (cb) cb(this)
}
