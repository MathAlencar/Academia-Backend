"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _clienteControllersjs = require('../../Controllers/pagamento/clienteControllers.js'); var _clienteControllersjs2 = _interopRequireDefault(_clienteControllersjs);

const router = new (0, _express.Router)();

router.post('/', _clienteControllersjs2.default.store);

exports. default = router;
