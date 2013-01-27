# domnode-dom

Turn DOM elements into readable / writable streams.

Designed for use with [Browserify](https://github.com/substack/browserify)
and [domnode](https://github.com/maxogden/domnode).

````javascript

var domstream = require('domstream')
  , input = document.querySelector('input[type=text]')
  , output = document.querySelector('div#output')

// replace the contents entirely with plain text generated
// by the <input> element!
domstream
  .createReadStream(input)
  .pipe(domstream.createWriteStream(output, 'text/plain'))


// grab a url and replace the body with its contents!

http
  .get('/some/url')
  .pipe(domstream.createAppendStream(output, 'text/html'))

// extend mimetypes:
domstream.WriteStream.prototype.constructImagePng = function(data) {
  var img = document.createElement('img')
  img.src = data
  return img
}

// now anything you type will be used as the source for an image tag!
// or replace the contents entirely with plain text!
domstream
  .createReadStream(input)
  .pipe(domstream.createWriteStream(output, 'image/png'))

````


To view the example:

````shell

$ git clone git://github.com/chrisdickinson/domnode-dom.git
$ cd domnode-dom.git
$ browserify example.js > examples/main.bundle.js
$ python -m SimpleHTTPServer 9090 &; bg;
$ open http://localhost:9090/

````

## API

#### domstream = require('domstream') -> DOMStream object

### Write API

#### domstream.createWriteStream(el, mimetype) -> DOMStream.WriteStream

Creates a writable stream out of an element. Writing to this stream
will replace the contents of `el` with the incoming data (transformed
by the mimetype.)

#### domstream.createAppendStream(el, mimetype) -> DOMStream.WriteStream

As above, this will create a writable stream to an element's contents.

However, unlike the above, writes to this element will append their data
(transformed by mimetype) to the element, instead of replacing it.

> ### Mimetypes
>
> Currently only two mimetypes are supported: `text/plain`
> and `text/html`. The writable stream object dispatches based on its
> mimetype in the following fashion:
>
> > `text/html` -> `writeStream.constructTextHtml`
> > `text/plain` -> `writeStream.constructTextPlain`
> > `application/json` -> `writeStream.constructApplicationJson` (example only)
>
> `text/plain` will properly create text nodes out of incoming data, while
> `text/html` will create full DOMNodes out of the incoming data.

### Read API

#### domstream.createReadStream(el, eventName[, preventDefault=true]) -> DOMStream.ReadStream

Creates a readable stream out of `eventName` events emitted by `el`.

In most cases, the emitted event will simply be the DOM event object.

However, in the case of `submit`, `change`, `keyup` and `keydown`, the
emitted data will be the current value of the element.

In the case of form elements, the current value will be a key-value mapping
of all of their constituent inputs:

````html

<form id="form">
    <input type="text" id="text" name="text" />
    <input type="submit" name="submit" value="submit" />
</form>
<a href="#" id="anchor">anchor</a>

````

````javascript

var form = document.getElementById('form')
  , text = document.getElementById('text')
  , anchor = document.getElementById('anchor')

var domstream = require('domstream')

// will emit dom Event objects on click
domstream.createReadStream(anchor, 'click')
  .on('data', function(data) { console.log(data) })

// will emit the current value of the input on keyup
domstream.createReadStream(text, 'keyup')
  .on('data', function(data) { console.log(data) })

// will emit an object containing { text: <value of text input> }
// when submitted
domstream.createReadStream(form, 'submit')
  .on('data', function(data) { console.log(data) })

````

## LICENSE

MIT. 
