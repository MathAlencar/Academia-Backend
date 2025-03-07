import multer from 'multer';
import multerConfig from '../config/multerDoc';

const upload = multer(multerConfig).single('pdf');

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

export default new PdfController();
