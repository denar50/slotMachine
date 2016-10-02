var http = require('http');
var requestHandler = require('./api/requestHandler')

var httpServer = http.createServer(requestHandler())

httpServer.listen(8000)
