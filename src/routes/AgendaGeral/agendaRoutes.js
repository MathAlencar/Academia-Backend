import { Router } from 'express';
import agendaControllers from '../../Controllers/agendaAula/agendaControllers';
import alunoLoginRiquered from '../../middlewares/alunoLoginRiquered';

const routes = Router();

routes.post('/', alunoLoginRiquered, agendaControllers.store);
routes.delete('/:id', alunoLoginRiquered, agendaControllers.delete);
routes.put('/:id', alunoLoginRiquered, agendaControllers.update);

export default routes;
