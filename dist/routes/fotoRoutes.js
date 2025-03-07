"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// import { Router } from 'express';
// import multer from 'multer';
// import FotoController from '../Controllers/FotoController';
// import multerConfig from '../config/multer';

// const router = Router();

// const upload = multer(multerConfig);

// router.post('/', upload.single('foto'), FotoController.store);

// export default router;

var _express = require('express');
var _FotoController = require('../Controllers/FotoController'); var _FotoController2 = _interopRequireDefault(_FotoController);

const router = _express.Router.call(void 0, );

router.post('/', _FotoController2.default.store);

exports. default = router;
