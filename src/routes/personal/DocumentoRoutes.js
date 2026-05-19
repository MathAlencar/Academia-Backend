import { Router } from 'express';
import personalRgControllers from '../../Controllers/personal/PersonalRGControllers';
import DocumentoFotoControllers from '../../Controllers/personal/DocumentoFotoControllers';
import DiplomaControllers from '../../Controllers/personal/DiplomaController';

const route = Router();

route.post('/', personalRgControllers.store); // será uma rota protegida pelo token personal
route.put('/:id', personalRgControllers.update); // será uma rota protegida pelo token personal

route.post('/foto/', DocumentoFotoControllers.store); // será uma rota protegida pelo token personal
route.put('/foto/:id', DocumentoFotoControllers.update); // será uma rota protegida pelo token personal

route.post('/diploma/', DiplomaControllers.store); // será uma rota protegida pelo token personal
route.put('/diploma/:id', DiplomaControllers.update); // será uma rota protegida pelo token personal

export default route;
