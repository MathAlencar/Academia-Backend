import { Router } from 'express';
import videoExercicioControllers from '../../Controllers/ExerciciosPersonal/videoExercicioControllers';
import loginRiquered from '../../middlewares/personalLoginRiquered';

const route = Router();

route.post('/', loginRiquered, videoExercicioControllers.store);

export default route;
