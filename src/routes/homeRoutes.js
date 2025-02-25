import { Router } from 'express';
import homecontrollers from '../Controllers/Homecontrollers';

const router = new Router();

router.get('/', homecontrollers.index);

export default router;
