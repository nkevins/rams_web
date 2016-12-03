var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.get('/', function(req, res, next) {  
    res.sendFile(__dirname + '/index.html');
});

var aircrafts = [];

io.on('connection', function(socket){
  console.log('a client connected');
  socket.emit('init', aircrafts);
  
  socket.on('update', function(msg){
    msg = JSON.parse(msg);
    //console.log('update: ' + msg);
    
    aircrafts[socket.id] = msg;
    
    //console.log(aircrafts);
    msg.socketId = socket.id;
    io.emit('update', msg);
  });
  
  
  socket.on('disconnect', function(){
    console.log('client disconnected');
    delete aircrafts[socket.id];
    io.emit('disconnect', socket.id);
  });
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log('listening on ' + (process.env.IP || "0.0.0.0") + ':' + (process.env.PORT || 3000));
});