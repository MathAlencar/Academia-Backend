import { Router } from 'express';
import clienteControllers from '../../Controllers/pagamento/clienteControllers.js';

const router = new Router();

router.post('/', clienteControllers.store);
router.get('/:cpfCnpj', clienteControllers.show);
// router.get('/', clienteControllers.index);
// router.put('/:id', clienteControllers.update);

export default router;