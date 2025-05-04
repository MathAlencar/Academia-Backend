import multer from 'multer';
import multerConfig from '../../config/multer';
import Fotos from '../../Models/FotoAlunos';
import Alunos from '../../Models/Alunos';

const upload = multer(multerConfig).single('foto');

class FotoControllers {
  store(req, res) {
    return upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Erro ao carregar foto' });
      }

      const { originalname, filename } = req.file;
      const { aluno_id } = req.body;

      const aluno = await Alunos.findByPk(aluno_id);

      if (!aluno) {
        return res.status(400).json({
          errors: ['aluno não encontrado'],
        });
      }

      const foto = await Fotos.create({ originalname, filename, aluno_id });

      return res.json(foto);
    });
  }
}

export default new FotoControllers();
