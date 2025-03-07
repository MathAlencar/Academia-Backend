"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _Usuarios = require('../Models/Usuarios'); var _Usuarios2 = _interopRequireDefault(_Usuarios);

class TokenControllers {
  async store(req, res) {
    try {
      const { email = '', password = '' } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          errors: ['Credenciais inválidas.'],
        });
      }

      const user = await _Usuarios2.default.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({
          errors: ['Usuário não existe.'],
        });
      }

      // Aqui você criou uma função na sua Classe usuário que valida usa o Hash para descobrir a senha do usuário.
      if (!(await user.passwordIsValida(password))) {
        return res.status(400).json({
          errors: ['Senha inválida.'],
        });
      }

      // payLoad -> vai ser as informações do noss usuário que podemos resgatar de dentro do nosso jwt.
      const { id } = user;
      const token = _jsonwebtoken2.default.sign({ id, email }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });

      return res.status(200).json({ token });
    } catch (e) {
      return res.status(400).json(null);
    }
  }
}

exports. default = new TokenControllers();
