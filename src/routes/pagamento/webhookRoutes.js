import { Router } from 'express';  
import webhookControllers from '../../Controllers/pagamento/webhookControllers.js';  
  
const router = new Router();  
  
router.post('/asaas/checkouts', webhookControllers.checkouts);
router.post('/asaas/account-status', webhookControllers.accountStatus);  
router.post('/asaas/transfers', webhookControllers.transfers);  
  
export default router;
