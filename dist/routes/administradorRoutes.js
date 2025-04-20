"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _administradorControllers = require('../Controllers/administradorControllers'); var _administradorControllers2 = _interopRequireDefault(_administradorControllers);
var _loginRiquered = require('../middlewares/loginRiquered'); var _loginRiquered2 = _interopRequireDefault(_loginRiquered);

const router = _express.Router.call(void 0, );

router.post('/', _administradorControllers2.default.store); // irá cadastrar um novo administrador.
router.get('/', _administradorControllers2.default.index); // irá exibir todos os administradores do sistema.
router.get('/:id', _loginRiquered2.default, _administradorControllers2.default.show); // Irá retornar de acorod com o parâmetro passado um administrador.

exports. default = router;
