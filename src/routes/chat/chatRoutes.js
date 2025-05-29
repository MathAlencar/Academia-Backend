import { Router } from 'express';
import ChatController from '../../Controllers/chat/chatControllers';

const router = new Router();

router.post('/conversas/', ChatController.store);
router.get('/conversa/:usuarioId/:personalId', ChatController.show);
router.get('/conversas/:usuarioId/:typeUser', ChatController.index);

router.get('/mensagens/:conversaId', ChatController.listarMensagens);
router.post('/mensagens', ChatController.enviarMensagem);

export default router;
