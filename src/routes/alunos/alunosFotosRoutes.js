import { Router } from 'express';
import alunosFotosControllers from '../../Controllers/alunos/alunosFotosControllers';

const route = Router();

route.post('/', alunosFotosControllers.store); // será uma rota protegida pelo token personal

export default route;
