"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Usuarios = require('../Models/Usuarios'); var _Usuarios2 = _interopRequireDefault(_Usuarios);

class Usuarioscontrollers {
  async store(req, res) {
    try {
      const novoUsuario = await _Usuarios2.default.create(req.body);
      const { id, nome, email } = novoUsuario;
      return res.json({ id, nome, email });
    } catch (e) {
      // Fazendo o tratamento do erro.
      return res.status(400).json({
        error: e.errors.map((err) => err.message),
      }); // Tratando os erros que são enviados do banco de dados.
    }
  }

  // index
  async index(req, res) {
    try {
      // attributes: ['id', 'nome', 'email'] -> usando isso você pode especificar quais colunas de informações você irá desejar.
      const users = await _Usuarios2.default.findAll({ attributes: ['id', 'nome', 'email'] });
      return res.json(users);
    } catch (e) {
      return res.json(null);
    }
  }

  // show
  async show(req, res) {
    try {
      const users = await _Usuarios2.default.findByPk(req.params.id);

      const { nome, id, email } = users;

      const objUser = {
        id,
        nome,
        email,
      };

      return res.json(objUser);
    } catch (e) {
      return res.json(null);
    }
  }

  // Update
  async update(req, res) {
    // Verificar se pede o token a cada atualização de e-mail ou não.

    try {
      if (!req.userId) { // Aqui você não vai mais receber um ID que o usuário manda no params, agora o update será feito pelo ID recebdio na validação do token do usuário. assim garantidndo que ele edite apenas o seu prórprio perfil quando necessário.
        return res.status(400).json({
          errors: ['ID não enviado'],
        });
      } // Fica até redundante realizar essa validação.

      const user = await _Usuarios2.default.findByPk(req.userId);

      if (!user) {
        return res.status(400).json({
          errors: ['Usuário não existe'],
        });
      }
      const novosDados = await user.update(req.body);

      return res.status(200).json(novosDados);
    } catch (e) {
      return res.status(400).json({
        error: e.errors.map((err) => err.message),
      });
    }
  }

  // Delete
  async delete(req, res) {
    try {
      const user = await _Usuarios2.default.findByPk(req.userId);

      if (!user) {
        return res.status(400).json({
          errors: ['Usuário não exsite'],
        });
      }

      await user.destroy();
      return res.json(null);
    } catch (e) {
      return res.status(400).json({
        error: e.errors.map((err) => err.message),
      });
    }
  }
}

exports. default = new Usuarioscontrollers();

/*
Para cada controllers podemos ter no máximo 5 metódos.

index - Listar todos os usuários. -> GET
Store/Create - Cria um novo usuário. -> POST
delete -> apaga usuário. -> DELETE
show - mostra um usuário. -> GET
update -> Atualizar um usuário. -> PATCH ou PUT ( PACTH altera somente um valor, e o PUT altera o objeto inteiro)

é o padrão que o mercado defini.
*/
