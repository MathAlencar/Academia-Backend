import { Router } from 'express';
import notificacaoControllers from '../../Controllers/personal/notificacaoControllers';
import personalLoginRiquered from '../../middlewares/personalLoginRiquered';

const router = Router();

router.get('/', personalLoginRiquered, notificacaoControllers.index);
router.patch('/:id/lida', personalLoginRiquered, notificacaoControllers.marcarComoLida);

export default router;
