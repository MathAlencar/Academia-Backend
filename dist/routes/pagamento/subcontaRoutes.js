"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _subcontaControllersjs = require('../../Controllers/pagamento/subcontaControllers.js'); var _subcontaControllersjs2 = _interopRequireDefault(_subcontaControllersjs);

const router = new (0, _express.Router)();

router.post('/', _subcontaControllersjs2.default.store);
router.put('/:personal_id', _subcontaControllersjs2.default.update);

exports. default = router;
