var domstream = require('./index')

var types = [
    'text'
  , 'checkbox'
  , 'select'
  , 'textarea'
  , 'submit'
]

var radio = ['radioinput_0', 'radioinput_1']

var form

for(var i = 0, len = types.length; i < len; ++i) {
  types[i] = document.getElementById(types[i]+'input')
}
for(var i = 0, len = radio.length; i < len; ++i) {
  radio[i] = document.getElementById(radio[i])
}

form = document.getElementById('form')

domstream.createEventStream(form, 'submit', true)
  .on('data', function(x) { for(var key in x) { console.log(key+': '+x[key]) } })

// API:
// domstream(el).createWriteStream(mimetype)
//   contents are overwritten with incoming data according to mimetype
//     (currently "text/plain" and "text/html" -- enabling and disabling html escaping)
//
// domstream(el).createAppendStream(mimetype)
//   similar to the above, but instead of replacing the contents, it
//   appends the new data on writes.
//
// domstream(el).createEventStream(eventName[, preventDefault=true])
//   takes an element and creates a readable stream of events.
//   when piping change or key events, it'll emit the contents
//   of the target element.
//
//   forms will emit 'data' events containing a hash of their
//   constituent inputs (by input name attr -> input value).

var output_el = document.getElementById('element')
  , input_el = document.getElementById('textinput')
  , output = domstream.createWriteStream(output_el, 'text/plain')
  , input = domstream.createEventStream(input_el, 'keyup')

input
  .on('data', function(x) { console.log(x) })
  .pipe(output)

