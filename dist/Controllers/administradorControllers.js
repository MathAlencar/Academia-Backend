"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Administrador = require('../Models/Administrador'); var _Administrador2 = _interopRequireDefault(_Administrador);

// Classe responsável por manipular novos usuários/administradores.
class AdministradorControllers {
  async store(req, res) {
    try {
      console.log(req.body);
      const newUser = await _Administrador2.default.create(req.body);
      const { id, nome, email } = newUser;
      return res.json({ id, nome, email });
    } catch (e) {
      return res.status(400).json({
        error: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
    try {
      const users = await _Administrador2.default.findAll({ attributes: ['id', 'nome', 'email'] });
      return res.json(users);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async show(req, res) {
    try {
      const user = await _Administrador2.default.findByPk(req.params.id, { attributes: ['id', 'nome', 'email'] });
      if (!user) {
        return res.status(404).json({
          errors: ['Usuário não encontrado'],
        });
      }
      return res.status(200).json(user);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

exports. default = new AdministradorControllers();
