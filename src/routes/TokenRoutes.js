import { Router } from 'express';
import tokenControllers from '../Controllers/tokenControllers';

const router = Router();

router.post('/', tokenControllers.store);
export default router;
