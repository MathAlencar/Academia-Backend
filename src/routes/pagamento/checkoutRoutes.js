import { Router } from 'express';  
import checkoutControllers from '../../Controllers/pagamento/checkoutControllers.js';  
  
const router = new Router();  
router.post('/', checkoutControllers.store);  
  
export default router;