import { Router } from 'express';
import tokenControllers from '../../Controllers/personal/personalTokenControllers';

const router = Router();

router.post('/', tokenControllers.store);

export default router;
