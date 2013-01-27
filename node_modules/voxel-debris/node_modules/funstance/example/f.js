var funstance = require('../');
var Foo = require('./foo');

var obj = new Foo(4);
var fobj = funstance(obj, function (n) {
    return n * obj.x
});

console.log(fobj(111));
fobj.on('beep', console.log);
fobj.beep();
