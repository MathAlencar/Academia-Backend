
import app from './App'; // OK
import { initWebsocket } from './WebSocket/websocket';
import http from 'http';

const port = 3018;

// O server REAL do Express
const server = http.createServer(app);

// Inicializa WebSocket em cima desse server
initWebsocket(server);

// Agora quem deve escutar é o server (NÃO o app)
server.listen(port, () => {
  console.log(`HTTP + WebSocket rodando na porta ${port}...`);
});
