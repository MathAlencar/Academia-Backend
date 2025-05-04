import { Router } from 'express';
import alunosControllers from '../../Controllers/alunos/alunosControllers';
import loginRiquered from '../../middlewares/alunoLoginRiquered';

const routes = Router();

routes.post('/', alunosControllers.store);
routes.get('/', alunosControllers.index);
routes.get('/:id', alunosControllers.show);
routes.put('/:id?', loginRiquered, alunosControllers.update);

export default routes;
