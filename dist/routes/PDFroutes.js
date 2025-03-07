"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _PdfControllers = require('../Controllers/PdfControllers'); var _PdfControllers2 = _interopRequireDefault(_PdfControllers);
var _loginRiquered = require('../middlewares/loginRiquered'); var _loginRiquered2 = _interopRequireDefault(_loginRiquered);

const router = _express.Router.call(void 0, );

router.post('/', _loginRiquered2.default, _PdfControllers2.default.store);

exports. default = router;
