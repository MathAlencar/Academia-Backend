"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/websocket.js
var _socketio = require('socket.io');

let io = null;

 function initWebsocket(server) {
  io = new (0, _socketio.Server)(server, {
    cors: {
      origin: '*', // depois você pode restringir pro domínio do front
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Cliente entra em uma "sala" da conversa
    socket.on('join_conversation', (conversaId) => {
      const roomName = `conversa_${conversaId}`;
      socket.join(roomName);
      console.log(`Socket ${socket.id} entrou na sala ${roomName}`);
    });

    // Se quiser, pode tratar sair, digitação, etc.
    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  return io;
} exports.initWebsocket = initWebsocket;

 function getIO() {
  if (!io) {
    throw new Error('Socket.io não inicializado');
  }
  return io;
} exports.getIO = getIO;
