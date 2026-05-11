"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _subcontaControllersjs = require('../../Controllers/pagamento/subcontaControllers.js'); var _subcontaControllersjs2 = _interopRequireDefault(_subcontaControllersjs);
var _personalLoginRiquered = require('../../middlewares/personalLoginRiquered'); var _personalLoginRiquered2 = _interopRequireDefault(_personalLoginRiquered);

const router = new (0, _express.Router)();

// Personal logado ativa recebimentos — personalId vem do token.
router.get('/me', _personalLoginRiquered2.default, _subcontaControllersjs2.default.showMe);
router.post('/ativar-recebimentos', _personalLoginRiquered2.default, _subcontaControllersjs2.default.store);
router.put('/', _personalLoginRiquered2.default, _subcontaControllersjs2.default.update);

exports. default = router;
