import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database';

import Aluno from '../Models/Alunos';
import Usuarios from '../Models/Usuarios';
import Foto from '../Models/Foto';

const models = [Aluno, Usuarios, Foto]; // Colocando todos os models dentro de um array.

const connection = new Sequelize(databaseConfig); // Criando a conexão com o banco de dados.

models.forEach((model) => model.init(connection)); // Criando a conexão para cada model do seu DB para realizar a conexão
models.forEach((model) => model.associate && model.associate(connection.models)); // Criando a conexão para cada model do seu DB para realizar a conexão
