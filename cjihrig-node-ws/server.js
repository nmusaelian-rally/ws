var http = require('http');
var WebSocketServer = require('websocket').server;

var server = http.createServer(function(request,response){
    console.log(new Date() + ' received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8080, function(){
    console.log(new Date() + 'server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server
    //,autoAcceptConnection: false //verify connection origin
});

//function originIsAllowed(origin){
    //logic here to decide if origin is allowed
    //return true;
//}

wsServer.on('request', function(request){
    if (!orignIsAllowed(request.origin)) {
        request.reject();
        console.log(new Date() + ' Connection from origin ' + request.origin + ' rejected' );
        return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log(new Date() + ' Connection accepted from origin ' + request.origin );
    connection.on('message', function(message){
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Message: ' + message.binaryData);
            connection.sendUTF(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description){
        console.log(new Date() + ' Peer ' + connection.remoteAddress + ' disconnected ' );
    });
});