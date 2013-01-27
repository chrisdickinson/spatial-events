var toolbar = require('toolbar')
toolbar('.bar-tab').on('select', function(selected) {
  console.log(selected)
})
