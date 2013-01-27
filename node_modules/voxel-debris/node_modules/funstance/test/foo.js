var test = require('tap').test;
var funstance = require('../');

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

test('funstantiate foo', function (t) {
    t.plan(8);
    
    var obj = new Foo(4);
    var fobj = funstance(obj, function (n) {
        return n * obj.x
    });
    
    t.equal(fobj(111), 444);
    fobj.on('beep', function (s) {
        t.equal(s, 'boop');
    });
    fobj.beep();
    
    t.equal(fobj.call(null, 25), 100);
    t.equal(fobj.apply(null, [64]), 256);
    t.equal(fobj.bind(null, 0.25)(), 1);
    
    t.ok(!obj.call);
    t.ok(!obj.apply);
    t.ok(!obj.bind);
});
