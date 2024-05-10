const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path')
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, { connectionStateRecovery: {} });

// io.on("send_message", (socket) => {
//     console.log(socket)
// });

// io.on("seen_message", (socket) => {
//     console.log(socket)
// });

// io.listen(3000);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on("connection", (socket) => {
    // console.log('socket connected: ' + socket.connected)
    // console.log(socket.id + ' connected')
    // console.log(socket)

    socket.on('chat message', (msg, callback) => {
        console.log('chat message: ' + msg);
        socket.broadcast.emit('receive message', msg);
        // io.emit('receive message',msg)
        callback('ok')
    });

    socket.on('room message', (msg, roomId, callback) => {

        console.log('room message: ' + msg);
        socket.to(roomId).emit('receive message', msg);
        callback('ok')
    });

    socket.on('join room', (roomId, cb) => {
        console.log('join room: ' + roomId);
        socket.join(roomId)
        cb(`Joined ${roomId}`)
    });

    socket.on('disconnect', () => {
        // console.log('user disconnected');
    });
});

server.listen(5000, () => {
    console.log('server running at http://localhost:5000');
});