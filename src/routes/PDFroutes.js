import { Router } from 'express';
import PdfControllers from '../Controllers/PdfControllers';
import loginRiquered from '../middlewares/loginRiquered';

const router = Router();

router.post('/', loginRiquered, PdfControllers.store);

export default router;
