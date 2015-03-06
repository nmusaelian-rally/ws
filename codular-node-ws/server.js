var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 8888;

var server = http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("server running at\n  => http://localhost:" + port);

var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server
});


var count = 0;
var clients = {};
//to listen for connection use on()
wsServer.on('request',function(r){
    var connection = r.accept('echo-protocol', r.origin);
    var id = count++;
    clients[id] = connection;
    console.log((new Date()) + ' Connection accepted [' + id + ']');
    
    connection.on('message', function(message) {
        // The string message that was sent to us
        var msgString = message.utf8Data;
        // Loop through all clients
        for(var i in clients){
            // Send a message to the client with the message
            clients[i].sendUTF(msgString);
        }
    });
    
    connection.on('close', function(reasonCode, description) {
        delete clients[id];
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});