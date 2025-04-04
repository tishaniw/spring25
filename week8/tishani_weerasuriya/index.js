const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
//const server = createServer(app);

const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  content: { type: String }
})

const messageModel = mongoose.model("Message", messageSchema)

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    const message = new messageModel();
    message.content = msg;
    message.save().then(m => {
      io.emit('chat message', msg);
    })
  });
});

server.listen(3000, async function(){
  await mongoose.connect("mongodb+srv://tishi34:Boop345@week8.poiff9k.mongodb.net/?retryWrites=true&w=majority&appName=week8")
  console.log('listening on *:3000');
});


app.get('/messages', async function(req,res) {
  res.json(await messageModel.find());

} );


io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', (msg) => {
        const timestamp = new Date().toLocaleTimeString(); 
        const messageWithTime = `[${timestamp}] ${msg}`;
        
        console.log('message:', messageWithTime);
        io.emit('chat message', messageWithTime); 
    });
  });

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });
    
//server.listen(3000, () => {
 // console.log('server running at http://localhost:3000');
//});