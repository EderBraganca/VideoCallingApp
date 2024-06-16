const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const cors = require('cors');  // Importe o pacote cors

const app = express();
const port = 5000;

// Use o middleware cors
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.2.6:3000'],  
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type'],  
  credentials: true 
}));

// Configuração para servir arquivos estáticos da build do React
app.use(express.static(path.join(__dirname, '../frontend-js/')));

// Configuração para HTTPS
const options = {
  key: fs.readFileSync('server.key'),     // Caminho para a chave privada
  cert: fs.readFileSync('server.cert')    // Caminho para o certificado
};

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend-js/index.html')); 
});

// Criação do servidor HTTPS
const server = https.createServer(options, app)
  .listen(port, '0.0.0.0', () => {  
    console.log(`Servidor HTTPS rodando em https://192.168.2.6:${port}/`);
  });

// Configuração do Socket.io para usar o servidor HTTPS
const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://192.168.2.6:3000'],  
    methods: ['GET', 'POST'],  
    allowedHeaders: ['Content-Type'],  
    credentials: true  
  }
});

io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  socket.on('createRoom', (room) => {
    socket.join(room);
    console.log(`Sala ${room} criada por ${socket.id}`);
  });

  socket.on('requestJoin', (room) => {
    socket.to(room).emit('joinRequest', { socketId: socket.id });
  });

  socket.on('acceptJoin', ({ room, socketId }) => {
    socket.to(socketId).emit('joinAccepted', room);
  });

  socket.on('offer', (data) => {
    socket.to(data.target).emit('offer', data);
  });

  socket.on('answer', (data) => {
    socket.to(data.target).emit('answer', data);
  });

  socket.on('candidate', (data) => {
    socket.to(data.target).emit('candidate', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});
