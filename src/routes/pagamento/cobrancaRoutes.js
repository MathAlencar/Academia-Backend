import { Router } from 'express';
import cobrancaControllers from '../../Controllers/pagamento/cobrancaControllers.js';
import loginRiquered from '../../middlewares/alunoLoginRiquered.js';

const router = new Router();

router.post('/', loginRiquered, cobrancaControllers.store);
router.get('/:id', loginRiquered, cobrancaControllers.show);

export default router;
