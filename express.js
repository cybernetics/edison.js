var express = require('express'),
    server = express(),
    port = 3000;
server.configure(function(){
	server.use('/edison', express.static(__dirname + '/dist'));
	server.use('/vendor', express.static(__dirname + '/bower_components'));
	server.use('/', express.static(__dirname + '/example'));
});
server.listen(port);
console.log('Express server is now listening on port:', port);
