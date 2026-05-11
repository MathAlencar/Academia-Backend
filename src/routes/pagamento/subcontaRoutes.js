import { Router } from 'express';
import subcontaControllers from '../../Controllers/pagamento/subcontaControllers.js';
import personalLoginRequired from '../../middlewares/personalLoginRiquered';

const router = new Router();

// Personal logado ativa recebimentos — personalId vem do token.
router.post('/ativar-recebimentos', personalLoginRequired, subcontaControllers.store);
router.put('/', personalLoginRequired, subcontaControllers.update);

export default router;
