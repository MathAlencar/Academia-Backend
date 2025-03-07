"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _multerDoc = require('../config/multerDoc'); var _multerDoc2 = _interopRequireDefault(_multerDoc);

const upload = _multer2.default.call(void 0, _multerDoc2.default).single('pdf');

class PdfController {
  async store(req, res) {
    return upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          errors: [err],
        });
      }

      return res.json(req.file);
    });
  }
}

exports. default = new PdfController();
