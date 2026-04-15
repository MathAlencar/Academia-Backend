import { Router } from 'express';
import enderecosControllers from '../../Controllers/enderecos/enderecosControllers';
import alunoLoginRiquered from '../../middlewares/alunoLoginRiquered';

const routes = Router();

routes.post('/', alunoLoginRiquered, enderecosControllers.store);
routes.put('/:id', alunoLoginRiquered, enderecosControllers.update);
routes.delete('/:id', alunoLoginRiquered, enderecosControllers.delete);

export default routes;
