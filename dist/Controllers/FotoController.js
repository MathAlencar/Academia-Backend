"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _multer3 = require('../config/multer'); var _multer4 = _interopRequireDefault(_multer3);

var _Foto = require('../Models/Foto'); var _Foto2 = _interopRequireDefault(_Foto);
var _Alunos = require('../Models/Alunos'); var _Alunos2 = _interopRequireDefault(_Alunos);

// capturando a foto enviado na requisição
const upload = _multer2.default.call(void 0, _multer4.default).single('foto');

class FotoControllers {
  store(req, res) {
    // Função responsável por salvar no disco a imagem.
    return upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          errors: [err.code],
        });
      }
      const { originalname, filename } = req.file;
      const { aluno_id } = req.body;

      const user = await _Alunos2.default.findByPk(aluno_id);

      if (!user) {
        return res.status(400).json({
          errors: ['Aluno não encontrado'],
        });
      }

      const originalName = originalname;
      const foto = await _Foto2.default.create({ originalName, filename, aluno_id });

      return res.json(foto);
    });
  }
}

exports. default = new FotoControllers();
