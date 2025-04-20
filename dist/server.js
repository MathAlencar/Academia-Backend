"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _App = require('./App'); var _App2 = _interopRequireDefault(_App); // Ele já está sendo exportado e executado ao mesmo tempo.

const port = 3016;

_App2.default.listen(port, () => {
  console.log(`O App está rodando na porta ${port}...`);
});
