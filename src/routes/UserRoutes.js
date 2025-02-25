import { Router } from 'express';
import Usercontrollers from '../Controllers/Usercontrollers';

import loginRiquired from '../middlewares/loginRiquered';

const router = Router();

router.get('/', Usercontrollers.index); // Não há uma necessidade de uma API que realize esse processo.
router.get('/:id', loginRiquired, Usercontrollers.show); // e muito menos esse perfil.
// router.put('/:id', Usercontrollers.update); // Realizar ajustes já que não é necessário um usuário realizar esse processo por ID
// router.delete('/:id', Usercontrollers.delete); // Realizar ajustes já que não é necessário um usuário realizar esse processo por ID

// São todos necessários.
router.post('/', Usercontrollers.store);
router.put('/', loginRiquired, Usercontrollers.update); // Realizar ajustes já que não é necessário um usuário realizar esse processo por ID
router.delete('/', loginRiquired, Usercontrollers.delete); // Realizar ajustes já que não é necessário um usuário realizar esse processo por ID

export default router; // Ele já está sendo exportado e executado ao mesmo tempo.
