const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*',
    }
});

app.use(cors());

let waitingParticipants = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-call', () => {
        waitingParticipants.push(socket.id);
        io.emit('waiting-list', waitingParticipants);
    });

    socket.on('allow-participant', (participantId) => {
        io.to(participantId).emit('allowed-to-join');
        waitingParticipants = waitingParticipants.filter(id => id !== participantId);
        io.emit('waiting-list', waitingParticipants);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        waitingParticipants = waitingParticipants.filter(id => id !== socket.id);
        io.emit('waiting-list', waitingParticipants);
    });

    socket.on('offer', (data) => {
        socket.to(data.target).emit('offer', data);
    });

    socket.on('answer', (data) => {
        socket.to(data.target).emit('answer', data);
    });

});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
