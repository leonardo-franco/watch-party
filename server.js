const express = require('express');
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use('/netflix', createProxyMiddleware({
  target: 'https://www.netflix.com',
  changeOrigin: true,
  pathRewrite: { '^/netflix': '' },
  onProxyRes: (proxyRes, req, res) => {
    // elimina cabeçalhos que impedem o embed
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
  }
}));

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', socket => {
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
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
