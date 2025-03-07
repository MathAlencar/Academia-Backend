"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize');
var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);

var _Alunos = require('../Models/Alunos'); var _Alunos2 = _interopRequireDefault(_Alunos);
var _Usuarios = require('../Models/Usuarios'); var _Usuarios2 = _interopRequireDefault(_Usuarios);
var _Foto = require('../Models/Foto'); var _Foto2 = _interopRequireDefault(_Foto);

const models = [_Alunos2.default, _Usuarios2.default, _Foto2.default]; // Colocando todos os models dentro de um array.

const connection = new (0, _sequelize.Sequelize)(_database2.default); // Criando a conexão com o banco de dados.

models.forEach((model) => model.init(connection)); // Criando a conexão para cada model do seu DB para realizar a conexão
models.forEach((model) => model.associate && model.associate(connection.models)); // Criando a conexão para cada model do seu DB para realizar a conexão
