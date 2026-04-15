import multer from 'multer';
import { extname, resolve } from 'path';

const aleatorio = () => Math.floor(Math.random() * 10000 + 10000);

export default {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      return cb(new multer.MulterError('Arquivo precisa ser PNG ou JPG'));
    }

    return cb(null, true);
  },
  storage: multer.diskStorage({ // definindo onde que será salvo o arquivo
    destination: (req, file, cb) => {
      cb(null, resolve(__dirname, '..', '..', 'upload', 'images')); // Aqui você está definindo o caminho pelo qual irá ser salvo a foto.
    },
    filename: (req, file, cb) => {
      // Aqui você está definindo o nome da foto que será salva no seu servidor, onde para exivar problemas de repetição.
      // você irá capturar o milisegundos, enquanto que ao lado vocÊ irá pegar a extensão do arquivo enviado.
      cb(null, `${Date.now()}_${aleatorio()}${extname(file.originalname)}`);
    },
  }), // irá salvar dentro de alguma pasta lá no servidor.
  
};
