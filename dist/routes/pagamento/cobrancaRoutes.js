"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _cobrancaControllersjs = require('../../Controllers/pagamento/cobrancaControllers.js'); var _cobrancaControllersjs2 = _interopRequireDefault(_cobrancaControllersjs);

const router = new (0, _express.Router)();

router.post('/', _cobrancaControllersjs2.default.store);
router.get('/:id', _cobrancaControllersjs2.default.show);

exports. default = router;
