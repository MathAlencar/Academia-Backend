import { Router } from 'express';
import PlanosPersonalController from '../../Controllers/personal/planosPersonalControllers.js';
import personalLoginRiquered from '../../middlewares/personalLoginRiquered.js';

const router = Router();

router.post('/', personalLoginRiquered, PlanosPersonalController.store);
router.put('/:id', PlanosPersonalController.update);
router.get('/:personal_id', PlanosPersonalController.index);
router.delete('/:id', PlanosPersonalController.delete);

export default router;
