import multer from 'multer';
import { extname, resolve } from 'path';

const aleatorio = () => Math.floor(Math.random() * 10000 + 10000);

export default {
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new multer.MulterError('Arquivo precisa ser em PDF'));
    }

    return cb(null, true);
  },
  storage: multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, resolve(__dirname, '..', '..', 'docs'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${aleatorio()}${extname(file.originalname)}`);
    },
  }),
};
