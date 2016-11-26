var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(227);

app.use(express.static('public'));

var usersConnected = 0;
var date = new Date();

io.on('connection', function(socket) {
    socket.on('info', function(data) {
        console.log("[" + socket.id + "] Connected");
        //SEND AVERTISSMENT OF CONNECTION
        io.emit('newConnection', {
            username: data.username,
            hours: date.getHours(),
            minute: date.getMinutes()
        });
        usersConnected++;

        //SEND AVERTISSMENT OF DISCONNECTION
        socket.on('disconnect', function() {
            console.log("[" + socket.id + "] Disconnected");
            io.emit('newDiconnection', {
                username: data.username,
                hours: date.getHours(),
                minute: date.getMinutes()
            });
            usersConnected--;
        });
        //SEND MESSAGE
        socket.on('sendMessage', function(dataMessage) {
            socket.broadcast.emit('ReceiveMessage', {
                username: data.username,
                hours: date.getHours(),
                minute: date.getMinutes(),
                message: dataMessage.message
            });
        });
    });
    //SEND USERS CONNECTED
    setInterval(function(){
      if(usersConnected >= 1){
        io.emit('usersConnected', {usersConnected});
      }
    }, 1000);
});
