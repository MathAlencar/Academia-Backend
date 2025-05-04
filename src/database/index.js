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

const models = [Administrador, Personal, PersonalFoto, PersonalAgenda, Alunos, AlunoFoto, AulaAgenda, Enderecos]; // Colocando todos os models dentro de um array.

const connection = new Sequelize(databaseConfig); // Criando a conexão com o banco de dados.

models.forEach((model) => model.init(connection)); // Criando a conexão para cada model do seu DB para realizar a conexão
models.forEach((model) => model.associate && model.associate(connection.models)); // Criando a conexão para cada model do seu DB para realizar a conexão
