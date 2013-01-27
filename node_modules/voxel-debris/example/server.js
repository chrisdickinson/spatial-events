var http = require('http');
var ecstatic = require('ecstatic');

var server = http.createServer(ecstatic(__dirname + '/static'));
server.listen(8085);
