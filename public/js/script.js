function username() {
    var username = prompt("Username: ");
    if (username.length == 0) {
        alert("Enter valide username.");
        location.reload();
    } else {
        return username;
    }
}

var socket = io('127.0.0.1:227');
var username = username();
var date = new Date();

//SEND INFO
socket.emit('info', {
    username: username
});

//NOTIFICATION LEFT/JOIN GROUP
socket.on('newConnection', function(data) {
    var html = '<p class="notification">' + data.username + ' joined the group <time>' + date.getHours() + ':' + date.getMinutes() + '</time></p>';
    $(html).appendTo($(".chat"));
});
socket.on('newDiconnection', function(data) {
    var html = '<p class="notification">' + data.username + ' left the group <time>' + date.getHours() + ':' + date.getMinutes() + '</time></p>';
    $(html).appendTo($(".chat"));
});

//SEND MESSAGE
$("form").submit(function(event) {
    event.preventDefault();
    var text = $("textarea[type=text]").val();
    if (text.length != 0) {
        socket.emit('sendMessage', {
            message: text
        });
        $("textarea[type=text]").val("");

        console.log(text);
        var html = '<li class="self"><div class="msg"><div class="user">' + username + '</div>' + text + '</p><time>' + date.getHours() + ':' + date.getMinutes() + '</time></div></li>'
        $(html).appendTo($(".chat"));
    }
});

//RECEIVE MESSAGE
socket.on('ReceiveMessage', function(data) {
    var html = '<li class="other"><div class="msg"><div class="user">' + data.username + '</div>' + data.message + '</p><time>' + date.getHours() + ':' + date.getMinutes() + '</time></div></li>'
    $(html).appendTo($(".chat"));
});

//USERS CONNECTED
socket.on('usersConnected', function(data){
  console.log(data.usersConnected);
  $(".members b").html(data.usersConnected);
});
