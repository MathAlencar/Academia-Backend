import { Router } from 'express';
import personalFotosControllers from '../../Controllers/personal/personalFotosControllers';

const route = Router();

route.post('/', personalFotosControllers.store); // será uma rota protegida pelo token personal

export default route;
