import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

import './database';

import express from 'express';
import AlunoRoutes from './routes/AlunoRoutes';
import UserRoutes from './routes/UserRoutes';
import TokenRoutes from './routes/TokenRoutes';
import fotoRoutes from './routes/fotoRoutes';
import pdfRoutes from './routes/PDFroutes';

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.static(resolve(__dirname, 'upload')));
  }

  routes() {
    this.app.use('/alunos/', AlunoRoutes);
    this.app.use('/users/', UserRoutes);
    this.app.use('/tokens/', TokenRoutes);
    this.app.use('/fotos/', fotoRoutes);
    this.app.use('/pdf/', pdfRoutes);
  }
}

export default new App().app;
