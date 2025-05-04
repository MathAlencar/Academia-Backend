import { Router } from 'express';
import agendaControllers from '../../Controllers/agendaAula/agendaControllers';

const routes = Router();

routes.post('/', agendaControllers.store);
routes.delete('/:id', agendaControllers.delete);
routes.put('/:id', agendaControllers.update);

export default routes;
