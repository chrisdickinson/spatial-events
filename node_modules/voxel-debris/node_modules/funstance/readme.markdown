# funstance

make an instance callable like a function

[![build status](https://secure.travis-ci.org/substack/funstance.png)](http://travis-ci.org/substack/funstance)

# example

## funstantiate a prototypical object

foo.js:

``` js
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
```

main.js:

``` js
var funstance = require('funstance');
var Foo = require('./foo');

var obj = new Foo(4);
var fobj = funstance(obj, function (n) {
    return n * obj.x
})

console.log(fobj(111));
fobj.on('beep', console.log);
fobj.beep();
```

Note that `.on()` is defined all the way in EventEmitter, which is 3 times
removed up the prototype chain from `fobj`, yet `fobj.on()` still works despite
being a function.

```
$ node main.js
444
boop
```

# methods

``` js
var funstance = require('funstance')
```

## var fobj = funstance(obj, fn)

Return a function with all the properties and prototypical methods as `obj`.
When `fobj()` is called, `fn()` will fire with the arguments and `this` set to
the `obj`.

Note that `obj` shouldn't be an Array or possibly other built-in types aside
from Object since some of them behave strangely for performance reasons.

# install

With [npm](https://npmjs.org) do:

```
npm install funstance
```

# license

MIT
