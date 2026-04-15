import { Router } from 'express';
import personalFotosControllers from '../../Controllers/personal/personalFotosControllers';
import loginRiquered from '../../middlewares/personalLoginRiquered';

const route = Router();

route.post('/', loginRiquered, personalFotosControllers.store);

export default route;
