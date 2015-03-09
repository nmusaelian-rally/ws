var http = require("http");
var fs = require("fs");
var port = process.argv[2] || 8888;

var server = http.createServer(function(request, response) {
    fs.readFile('index.html', 'binary', function(err, file){
        response.writeHead(200);
        response.write(file, "binary");
        response.end();
    });
}).listen(parseInt(port, 10), function(){console.log("server running at\n  => http://localhost:3000") });


var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server
});

var count = 0;
var clients = {};

wsServer.on('request',function(request){
    var connection = request.accept('echo-protocol', request.origin);
    var id = count++;
    clients[id] = connection;
    console.log((new Date()) + ' Connection accepted [' + id + ']');
    
    connection.on('message', function(message) {
        var msgString = message.utf8Data;
        for(var i in clients){
            console.log('Received Message: ' + message.utf8Data);
            // Send a message to the client(s) with the message
            clients[i].sendUTF(msgString);
        }
    });
    
    connection.on('close', function(reasonCode, description) {
        delete clients[id];
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});