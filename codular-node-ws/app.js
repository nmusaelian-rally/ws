window.onload = function() {
    var ws = new WebSocket('ws://localhost:3000', 'echo-protocol');

    function sendMessage(){
        var message = document.getElementById('message').value;
        ws.send(message);
    }
    
    var but = document.getElementById('but');
    but.onclick = sendMessage;
    
    ws.addEventListener("message", function(e) {
        // The data is simply the message that we're sending back
        var msg = e.data;
        // Append the message
        document.getElementById('chatlog').innerHTML += '<br>' + msg;
    });
}

