// src/websocket.js
import { Server } from 'socket.io';

let io = null;

export function initWebsocket(server) {
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : [];

  io = new Server(server, {
    cors: {
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
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
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io não inicializado');
  }
  return io;
}
