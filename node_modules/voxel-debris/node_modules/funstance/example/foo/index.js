var inherits = require('inherits');
var Stream = require('stream');

module.exports = Foo;
inherits(Foo, Stream);

function Foo (x) {
    this.x = x;
}

Foo.prototype.beep = function () {
    this.emit('beep', 'boop');
};
