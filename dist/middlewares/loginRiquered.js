"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken); // Importanto a biblioteca para validação do token.
var _Usuarios = require('../Models/Usuarios'); var _Usuarios2 = _interopRequireDefault(_Usuarios);

// Exportando a função que irá fazer a vaidação do meu token.

exports. default = async (req, res, next) => {
  const { authorization } = req.headers; // recebendo o meu token que vem do header

  // Caso for falso ele irá reorna ruma mensagem ao usuário.
  if (!authorization) {
    return res.status(401).json({
      errors: ['Login required'],
    });
  }

  // Separando o texto do token ou seja o  bearer do próprio token.
  const [, token] = authorization.split(' ');

  // Fazendo um try catch, onde ele irá verificar se o token é valido ou não, caso não ele irá receber uma mensagem e cairá no catch
  try {
    // usando o metódo da classe jwt para realizar a validação do token enviado pelo usuário.
    const dados = _jsonwebtoken2.default.verify(token, process.env.TOKEN_SECRET); // Aqui ele irá retornar os dados do usuário, que será retirado do prórpio token
    const { id, email } = dados; // realizando a desestruturação do objeto.

    // verificando se o e-mail é igual ao que está logado no banco de dados ( para se caso rolar algum update ):
    const user = await _Usuarios2.default.findOne({
      where: {
        id,
        email,
      },
    });
    // const { idValidate, emailValidate } = data.dataValues;

    if (!user) {
      return res.status(401).json({
        errors: ['Login required'],
      });
    }

    // Aqui quando for passar para o próxima requisição, esses dados já estarão sendo enviados tbm.
    req.userId = id;
    req.userEmail = email;

    return next(); // next para a próxima requisição.
  } catch (e) {
    return res.status(401).json({
      errors: ['Token expirado ou inválido'],
    });
  }
};
