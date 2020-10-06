// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var ColorHash = require('color-hash');

var colorHash = new ColorHash({saturation: [0.35, 0.5, 0.65]});

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

var numUsers = 0;

io.on('connection', (socket) => {
  console.log('클라이언트가 접속했습니다.');
  var addedUser = false;

  socket.on('add user', (username) => {
    console.log('username:', username);
    var now = Math.random().toString(36);
    if (addedUser) return;
    socket.username = username;
    socket.usercolor = colorHash.hex(now);
    io.emit('welcomeUser', username);
    });

  socket.on('send_message', (data) => {
    console.log('data:', data);
    io.emit('new_message', {
      username: socket.username,
      message: data,
      usercolor : socket.usercolor,
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {

      // echo globally that this client has left
      socket.broadcast.emit('user_left', {
        username: socket.username,
      });
  });
});
