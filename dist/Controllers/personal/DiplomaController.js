"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }      
var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _multerConfigDoc = require('../../config/multerConfigDoc'); var _multerConfigDoc2 = _interopRequireDefault(_multerConfigDoc);
var _Diploma = require('../../Models/Diploma'); var _Diploma2 = _interopRequireDefault(_Diploma);
var _Personal = require('../../Models/Personal'); var _Personal2 = _interopRequireDefault(_Personal);

const upload = _multer2.default.call(void 0, _multerConfigDoc2.default).single('file');

class DocumentoControllers {
  
  async store(req, res) {
    return upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Erro ao carregar Documento', err });
      }

      const { originalname, filename } = req.file;
      const { personal_id } = req.body;

      const personal = await _Personal2.default.findByPk(personal_id);

      if (!personal) {
        return res.status(400).json({
          errors: ['Personal não encontrado'],
        });
      }

      const documento = await _Diploma2.default.create({ originalname, filename, personal_id });

      return res.json(documento);
    });
  }

  async update(req, res){
    try{
        if (!req.params.id) {
            return res.status(400).json({
                errors: ['Chave não enviada para update'],
            });
        }
        
        const documento = await _Diploma2.default.findByPk(req.params.id);

        if (!documento) {
            return res.status(400).json({
                errors: ['Documento não localizado!'],
            });
        }

        const novosDados = await documento.update(req.body);

        return res.status(200).json(novosDados);
    }catch(e){
        return res.status(400).json({
            errors: _optionalChain([e, 'access', _ => _.errors, 'optionalAccess', _2 => _2.map, 'call', _3 => _3((err) => err.message)]) || [e.message],
        });
    }
  }
  
}

exports. default = new DocumentoControllers();
