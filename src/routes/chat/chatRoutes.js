import { Router } from 'express';
import ChatController from '../../Controllers/chat/chatControllers';
import alunoLoginRiquered from '../../middlewares/alunoLoginRiquered';

const router = new Router();

router.post('/conversas/', alunoLoginRiquered, ChatController.store);
router.get('/conversa/:usuarioId/:personalId', alunoLoginRiquered, ChatController.show);
router.get('/conversas/:usuarioId/:typeUser', alunoLoginRiquered, ChatController.index);

router.get('/mensagens/:conversaId', alunoLoginRiquered, ChatController.listarMensagens);
router.post('/mensagens', alunoLoginRiquered, ChatController.enviarMensagem);

export default router;
