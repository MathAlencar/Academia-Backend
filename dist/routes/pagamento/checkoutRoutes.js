"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');  
var _checkoutControllersjs = require('../../Controllers/pagamento/checkoutControllers.js'); var _checkoutControllersjs2 = _interopRequireDefault(_checkoutControllersjs);  
  
const router = new (0, _express.Router)();  
router.post('/', _checkoutControllersjs2.default.store);  
  
exports. default = router;