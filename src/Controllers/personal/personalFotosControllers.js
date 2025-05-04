import multer from 'multer';
import multerConfig from '../../config/multer';
import Fotos from '../../Models/FotoPersonal';
import Personal from '../../Models/Personal';

const upload = multer(multerConfig).single('foto');

class FotoControllers {
  store(req, res) {
    return upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Erro ao carregar foto' });
      }

      const { originalname, filename } = req.file;
      const { personal_id } = req.body;

      const personal = await Personal.findByPk(personal_id);

      if (!personal) {
        return res.status(400).json({
          errors: ['Personal não encontrado'],
        });
      }

      const foto = await Fotos.create({ originalname, filename, personal_id });

      return res.json(foto);
    });
  }
}

export default new FotoControllers();
