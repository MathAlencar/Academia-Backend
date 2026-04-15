import { Router } from 'express';
import alunosFotosControllers from '../../Controllers/alunos/alunosFotosControllers';
import loginRiquered from '../../middlewares/alunoLoginRiquered';

const route = Router();

route.post('/', loginRiquered, alunosFotosControllers.store);

export default route;
