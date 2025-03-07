"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _TokenControllers = require('../Controllers/TokenControllers'); var _TokenControllers2 = _interopRequireDefault(_TokenControllers);

const router = _express.Router.call(void 0, );

router.post('/', _TokenControllers2.default.store);
exports. default = router;
