import { Router } from 'express';
import alunosControllers from '../Controllers/AlunosControllers';
import loginRiquered from '../middlewares/loginRiquered';

const router = new Router();

router.get('/', alunosControllers.index);
router.get('/:id', alunosControllers.show);
router.put('/:id', alunosControllers.update);
router.post('/', loginRiquered, alunosControllers.store);
router.delete('/:id', loginRiquered, alunosControllers.delete);

export default router;
