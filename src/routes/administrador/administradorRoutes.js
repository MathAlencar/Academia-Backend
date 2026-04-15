import { Router } from 'express';
import administradorControllers from '../../Controllers/admin/administradorControllers';
import loginRiquered from '../../middlewares/adminLoginRiquered';

const router = Router();

router.post('/', loginRiquered, administradorControllers.store); // irá cadastrar um novo administrador.
router.get('/', loginRiquered, administradorControllers.index); // irá exibir todos os administradores do sistema.
router.get('/:id', loginRiquered, administradorControllers.show); // Irá retornar de acordo com o parâmetro passado um administrador.
router.put('/:id?', loginRiquered, administradorControllers.update);

export default router;
