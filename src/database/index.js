import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database';

import Administrador from '../Models/Administrador';
import Personal from '../Models/Personal';
import PersonalFoto from '../Models/FotoPersonal';
import PersonalAgenda from '../Models/PersonalAgenda';
import Alunos from '../Models/Alunos';
import AlunoFoto from '../Models/FotoAlunos';
import AulaAgenda from '../Models/AgendaAulas';
import Enderecos from '../Models/Enderecos';
import Conversa from '../Models/Conversa';
import Mensagem from '../Models/Mensagem';
import Subconta from '../Models/Subconta';
import PlanosPersonal from '../Models/PlanosPersonal.js';

const models = [
  Administrador,
  Personal,
  PersonalFoto,
  PersonalAgenda,
  Alunos,
  AlunoFoto,
  AulaAgenda,
  Enderecos,
  Conversa,
  Mensagem,
  Subconta,
  PlanosPersonal,
];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));
