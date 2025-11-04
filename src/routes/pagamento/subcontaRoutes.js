import { Router } from 'express';
import subcontaControllers from '../../Controllers/pagamento/subcontaControllers.js';

const router = new Router();

router.post('/', subcontaControllers.store);
router.put('/:personal_id', subcontaControllers.update);

export default router;
