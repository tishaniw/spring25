const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });

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
    
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});