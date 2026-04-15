import { Router } from 'express';
import clienteControllers from '../../Controllers/pagamento/clienteControllers.js';
import loginRiquered from '../../middlewares/alunoLoginRiquered.js';

const router = new Router();

router.post('/', loginRiquered, clienteControllers.store);

export default router;
