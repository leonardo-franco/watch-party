const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Socket.IO
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.on('join', ({ sessionId, user }) => {
    socket.join(sessionId);
    socket.to(sessionId).emit('systemMessage', `${user} entrou na sessão.`);
  });

  socket.on('chatMessage', ({ sessionId, user, text }) => {
    io.to(sessionId).emit('chatMessage', { user, text });
  });

  socket.on('playerAction', ({ sessionId, action, time }) => {
    io.to(sessionId).emit('playerAction', { action, time });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
