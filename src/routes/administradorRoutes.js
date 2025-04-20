import { Router } from 'express';
import administradorControllers from '../Controllers/administradorControllers';
import loginRiquered from '../middlewares/loginRiquered';

const router = Router();

router.post('/', administradorControllers.store); // irá cadastrar um novo administrador.
router.get('/', administradorControllers.index); // irá exibir todos os administradores do sistema.
router.get('/:id', loginRiquered, administradorControllers.show); // Irá retornar de acorod com o parâmetro passado um administrador.

export default router;
