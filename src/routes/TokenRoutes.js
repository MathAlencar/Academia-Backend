import { Router } from 'express';
import TokenControllers from '../Controllers/TokenControllers';

const router = Router();

router.post('/', TokenControllers.store);
export default router;
