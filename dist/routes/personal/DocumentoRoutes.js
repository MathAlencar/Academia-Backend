"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _PersonalRGControllers = require('../../Controllers/personal/PersonalRGControllers'); var _PersonalRGControllers2 = _interopRequireDefault(_PersonalRGControllers);
var _DocumentoFotoControllers = require('../../Controllers/personal/DocumentoFotoControllers'); var _DocumentoFotoControllers2 = _interopRequireDefault(_DocumentoFotoControllers);
var _DiplomaController = require('../../Controllers/personal/DiplomaController'); var _DiplomaController2 = _interopRequireDefault(_DiplomaController);

const route = _express.Router.call(void 0, );

route.post('/', _PersonalRGControllers2.default.store); // será uma rota protegida pelo token personal
route.put('/:id', _PersonalRGControllers2.default.update); // será uma rota protegida pelo token personal

route.post('/foto/', _DocumentoFotoControllers2.default.store); // será uma rota protegida pelo token personal
route.put('/foto/:id', _DocumentoFotoControllers2.default.update); // será uma rota protegida pelo token personal

route.post('/diploma/', _DiplomaController2.default.store); // será uma rota protegida pelo token personal
route.put('/diploma/:id', _DiplomaController2.default.update); // será uma rota protegida pelo token personal

exports. default = route;
