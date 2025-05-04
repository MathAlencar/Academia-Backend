import { Router } from 'express';
import personalAgendaControllers from '../../Controllers/personal/personalAgendaControllers';
import personalLoginRiquered from '../../middlewares/personalLoginRiquered';

const router = Router();

router.post('/', personalLoginRiquered, personalAgendaControllers.store);
router.delete('/:id', personalLoginRiquered, personalAgendaControllers.delete);

export default router;
