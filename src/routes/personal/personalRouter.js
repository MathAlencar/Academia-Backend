import { Router } from 'express';
import personalControllers from '../../Controllers/personal/personalControllers';
import loginRiquered from '../../middlewares/personalLoginRiquered';

const router = Router();

router.post('/', personalControllers.store);
router.get('/', personalControllers.index);
router.get('/:id', personalControllers.show);
router.put('/:id?', loginRiquered, personalControllers.update);

export default router;
