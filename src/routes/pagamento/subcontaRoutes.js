import { Router } from 'express';
import subcontaControllers from '../../Controllers/pagamento/subcontaControllers.js';
import loginRiquered from '../../middlewares/personalLoginRiquered.js';

const router = new Router();

router.post('/', loginRiquered, subcontaControllers.store);
router.put('/:personal_id', loginRiquered, subcontaControllers.update);

export default router;
