import { Router } from 'express';
import tokenControllers from '../../Controllers/alunos/alunosTokensControllers';

const router = Router();

router.post('/', tokenControllers.store);

export default router;
