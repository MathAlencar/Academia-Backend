      
import multer from 'multer';
import multerConfig from '../../config/multerConfigDoc';
import Documento from '../../Models/RGPersonal';
import Personal from '../../Models/Personal';

const upload = multer(multerConfig).single('file');

class DocumentoControllers {
  
  async store(req, res) {
    return upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Erro ao carregar Documento', err });
      }

      const { originalname, filename } = req.file;
      const { personal_id } = req.body;

      const personal = await Personal.findByPk(personal_id);

      if (!personal) {
        return res.status(400).json({
          errors: ['Personal não encontrado'],
        });
      }

      const documento = await Documento.create({ originalname, filename, personal_id });

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
        
        const documento = await Documento.findByPk(req.params.id);

        if (!documento) {
            return res.status(400).json({
                errors: ['Documento não localizado!'],
            });
        }

        const novosDados = await documento.update(req.body);

        return res.status(200).json(novosDados);
    }catch(e){
        return res.status(400).json({
            errors: e.errors?.map((err) => err.message) || [e.message],
        });
    }
  }
  
}

export default new DocumentoControllers();
