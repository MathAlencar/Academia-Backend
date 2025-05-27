import { Router } from 'express';
import ChatController from '../../Controllers/chat/chatControllers';

const router = new Router();

router.post('/conversas/', ChatController.criarConversa);

router.get('/conversas/:usuarioId/:personalId', ChatController.listarConversasDoUsuario);
router.get('/mensagens/:conversaId', ChatController.listarMensagens);
router.post('/mensagens', ChatController.enviarMensagem);

export default router;
