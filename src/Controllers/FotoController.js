import multer from 'multer';
import multerConfig from '../config/multer';

import Foto from '../Models/Foto';
import Aluno from '../Models/Alunos';

// capturando a foto enviado na requisição
const upload = multer(multerConfig).single('foto');

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

      const user = await Aluno.findByPk(aluno_id);

      if (!user) {
        return res.status(400).json({
          errors: ['Aluno não encontrado'],
        });
      }

      const originalName = originalname;
      const foto = await Foto.create({ originalName, filename, aluno_id });

      return res.json(foto);
    });
  }
}

export default new FotoControllers();
