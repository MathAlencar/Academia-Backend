"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
var _path = require('path');

_dotenv2.default.config();

require('./database');

var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _AlunoRoutes = require('./routes/AlunoRoutes'); var _AlunoRoutes2 = _interopRequireDefault(_AlunoRoutes);
var _UserRoutes = require('./routes/UserRoutes'); var _UserRoutes2 = _interopRequireDefault(_UserRoutes);
var _TokenRoutes = require('./routes/TokenRoutes'); var _TokenRoutes2 = _interopRequireDefault(_TokenRoutes);
var _fotoRoutes = require('./routes/fotoRoutes'); var _fotoRoutes2 = _interopRequireDefault(_fotoRoutes);
var _PDFroutes = require('./routes/PDFroutes'); var _PDFroutes2 = _interopRequireDefault(_PDFroutes);

class App {
  constructor() {
    this.app = _express2.default.call(void 0, );
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(_express2.default.urlencoded({ extended: true }));
    this.app.use(_express2.default.json());
    this.app.use(_express2.default.static(_path.resolve.call(void 0, __dirname, 'upload')));
  }

  routes() {
    this.app.use('/alunos/', _AlunoRoutes2.default);
    this.app.use('/users/', _UserRoutes2.default);
    this.app.use('/tokens/', _TokenRoutes2.default);
    this.app.use('/fotos/', _fotoRoutes2.default);
    this.app.use('/pdf/', _PDFroutes2.default);
  }
}

exports. default = new App().app;
