import { Router } from 'express';
import cobrancaControllers from '../../Controllers/pagamento/cobrancaControllers.js';

const router = new Router();

router.post('/', cobrancaControllers.store);
router.get('/:id', cobrancaControllers.show);

export default router;