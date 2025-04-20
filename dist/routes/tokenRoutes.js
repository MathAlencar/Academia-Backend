"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _tokenControllers = require('../Controllers/tokenControllers'); var _tokenControllers2 = _interopRequireDefault(_tokenControllers);

const router = _express.Router.call(void 0, );

router.post('/', _tokenControllers2.default.store);
exports. default = router;
