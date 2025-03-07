"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _Usercontrollers = require('../Controllers/Usercontrollers'); var _Usercontrollers2 = _interopRequireDefault(_Usercontrollers);

var _loginRiquered = require('../middlewares/loginRiquered'); var _loginRiquered2 = _interopRequireDefault(_loginRiquered);

const router = _express.Router.call(void 0, );

router.get('/', _Usercontrollers2.default.index); // Não há uma necessidade de uma API que realize esse processo.
router.get('/:id', _loginRiquered2.default, _Usercontrollers2.default.show); // e muito menos esse perfil.
// router.put('/:id', Usercontrollers.update); // Realizar ajustes já que não é necessário um usuário realizar esse processo por ID
// router.delete('/:id', Usercontrollers.delete); // Realizar ajustes já que não é necessário um usuário realizar esse processo por ID

// São todos necessários.
router.post('/', _Usercontrollers2.default.store);
router.put('/', _loginRiquered2.default, _Usercontrollers2.default.update); // Realizar ajustes já que não é necessário um usuário realizar esse processo por ID
router.delete('/', _loginRiquered2.default, _Usercontrollers2.default.delete); // Realizar ajustes já que não é necessário um usuário realizar esse processo por ID

exports. default = router; // Ele já está sendo exportado e executado ao mesmo tempo.
