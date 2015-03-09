#!/usr/bin/env node
var WebSocketClent = require('websocket').client;
var client = new WebSocketClent();

client.on('connectionFailed', function(error){
    console.log('Connect error: ' + error.toString());
});

client.on('connect',function(connection){
    console.log('WebSocket Client connected');
    connection.on('error', function(error){
        console.log('Connection error ' + error.toString());
    });
    connection.on('close', function(){
        console.log('Connection closed');
    });
    connection.on('message', function(message){
        if (message.type === 'utf8') {
            console.log('Received utf8 Message: ' + message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received binary Message: ' + message.binaryData);
        }
    });
    
    function sendRandomNumber() {
        if (connection.connected) {
            var number = Math.round(Math.random());
            connection.sendUTF(number.toString());
            setTimeout(sendRandomNumber, 5000)
        }
    }
    sendRandomNumber();
});

client.connect('ws://localhost:3000', 'echo-protocol');