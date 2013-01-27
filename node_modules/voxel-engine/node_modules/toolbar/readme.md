# toolbar

keyboard selectable toolbar for selecting an active tool

when users hit 0-9 on their keyboard or click an item on the toolbar `toolbar` will emit a javascript event that will tell you which item in the toolbar has been selected

## install

step 1:

`npm install toolbar`

step 2: 

include some html in your page that looks like this:

```html
<nav class="bar-tab">
  <ul class="tab-inner">
    <li class="tab-item active">
      <a href="">
        <img class="tab-icon" src="icons/first-tool.png">
        <div class="tab-label">First Tool</div>
      </a>
    </li>
    <li class="tab-item">
      <a href="">
        <img class="tab-icon" src="icons/second-tool.png">
        <div class="tab-label">Second Tool</div>
      </a>
    </li>
  </ul>
</nav>
```

step 3:

`
var toolbar = require('toolbar')
toolbar('.bar-tab')
`

use [browserify](http://browserify.org/) to package toolbar for use in your client side app!

step 4:

```javascript
toolbar.on('select', function(item) {
  // item is the .tab-label innerText
})
```

## bonus advice

to convert svgs from the noun project into cute little transparent pngs:

`mogrify -fill "#ffffff" -opaque "#000000" -background none -format png *.svg`

## license

BSD