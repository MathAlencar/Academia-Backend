import { Router } from 'express';
import enderecosControllers from '../../Controllers/enderecos/enderecosControllers';

const routes = Router();

routes.post('/', enderecosControllers.store);
routes.put('/:id', enderecosControllers.update);
routes.delete('/:id', enderecosControllers.delete);

export default routes;
