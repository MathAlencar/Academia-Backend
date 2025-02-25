import dotenv from 'dotenv';

dotenv.config();

import './src/database';

import express from 'express';
import HomeRoutes from './src/routes/homeRoutes';
import UserRoutes from './src/routes/UserRoutes';
import TokenRoutes from './src/routes/TokenRoutes';

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  routes() {
    this.app.use('/', HomeRoutes);
    this.app.use('/users/', UserRoutes);
    this.app.use('/tokens/', TokenRoutes);
  }
}

export default new App().app;
