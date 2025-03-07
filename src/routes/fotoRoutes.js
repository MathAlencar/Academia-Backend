// import { Router } from 'express';
// import multer from 'multer';
// import FotoController from '../Controllers/FotoController';
// import multerConfig from '../config/multer';

// const router = Router();

// const upload = multer(multerConfig);

// router.post('/', upload.single('foto'), FotoController.store);

// export default router;

import { Router } from 'express';
import FotoController from '../Controllers/FotoController';

const router = Router();

router.post('/', FotoController.store);

export default router;
