import { Router } from 'express';  
import checkoutControllers from '../../Controllers/pagamento/checkoutControllers.js';  
import alunoLoginRiquered from '../../middlewares/alunoLoginRiquered.js';
  
const router = new Router();  
router.post('/', alunoLoginRiquered, checkoutControllers.store);  
router.get('/:id', alunoLoginRiquered, checkoutControllers.show);
  
export default router;
