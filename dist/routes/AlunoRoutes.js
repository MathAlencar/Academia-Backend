"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _AlunosControllers = require('../Controllers/AlunosControllers'); var _AlunosControllers2 = _interopRequireDefault(_AlunosControllers);
var _loginRiquered = require('../middlewares/loginRiquered'); var _loginRiquered2 = _interopRequireDefault(_loginRiquered);

const router = new (0, _express.Router)();

router.get('/', _AlunosControllers2.default.index);
router.get('/:id', _AlunosControllers2.default.show);
router.put('/:id', _AlunosControllers2.default.update);
router.post('/', _loginRiquered2.default, _AlunosControllers2.default.store);
router.delete('/:id', _loginRiquered2.default, _AlunosControllers2.default.delete);

exports. default = router;
