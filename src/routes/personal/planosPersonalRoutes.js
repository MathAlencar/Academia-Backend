import { Router } from 'express';
import PlanosPersonalController from '../../Controllers/personal/planosPersonalControllers.js';
import loginRiquered from '../../middlewares/personalLoginRiquered.js';

const router = Router();

router.post('/', loginRiquered, PlanosPersonalController.store);
router.put('/:id', loginRiquered, PlanosPersonalController.update);
router.get('/:personal_id', PlanosPersonalController.index);
router.delete('/:id', loginRiquered, PlanosPersonalController.delete);

export default router;
