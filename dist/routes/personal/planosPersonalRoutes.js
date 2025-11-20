"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _planosPersonalControllersjs = require('../../Controllers/personal/planosPersonalControllers.js'); var _planosPersonalControllersjs2 = _interopRequireDefault(_planosPersonalControllersjs);

const router = _express.Router.call(void 0, );

router.post('/', _planosPersonalControllersjs2.default.store);
router.put('/:id', _planosPersonalControllersjs2.default.update);
router.get('/:personal_id', _planosPersonalControllersjs2.default.index);
router.delete('/:id', _planosPersonalControllersjs2.default.delete);

exports. default = router;
