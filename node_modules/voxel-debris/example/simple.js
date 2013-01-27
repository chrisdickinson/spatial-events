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
game.controls.pitchObject.rotation.x = -1.5;

var explode = require('../')(game, { power : 1.5 });

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
