"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize');
var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);
var _Administrador = require('../Models/Administrador'); var _Administrador2 = _interopRequireDefault(_Administrador);

const models = [_Administrador2.default]; // Colocando todos os models dentro de um array.

const connection = new (0, _sequelize.Sequelize)(_database2.default); // Criando a conexão com o banco de dados.

models.forEach((model) => model.init(connection)); // Criando a conexão para cada model do seu DB para realizar a conexão
// models.forEach((model) => model.associate && model.associate(connection.models)); // Criando a conexão para cada model do seu DB para realizar a conexão
