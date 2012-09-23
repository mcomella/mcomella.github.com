var static = require('node-static');
var http = require('http');

var file = new(static.Server)();
var port = process.env.PORT || 3000;

http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(port);
