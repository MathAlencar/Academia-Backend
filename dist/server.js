"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _App = require('./App'); var _App2 = _interopRequireDefault(_App); // OK
var _websocket = require('./WebSocket/websocket');
var _http = require('http'); var _http2 = _interopRequireDefault(_http);

const port = 3018;

// O server REAL do Express
const server = _http2.default.createServer(_App2.default);

// Inicializa WebSocket em cima desse server
_websocket.initWebsocket.call(void 0, server);

// Agora quem deve escutar é o server (NÃO o app)
server.listen(port, () => {
  console.log(`HTTP + WebSocket rodando na porta ${port}...`);
});
