"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Alunos = require('../Models/Alunos'); var _Alunos2 = _interopRequireDefault(_Alunos);
var _Foto = require('../Models/Foto'); var _Foto2 = _interopRequireDefault(_Foto);

class AlunoControllers {
  async store(req, res) {
    try {
      const novoAluno = await _Alunos2.default.create(req.body);
      const { id, nome, email } = novoAluno;
      console.log(novoAluno);
      return res.json({ id, nome, email });
    } catch (e) {
      return res.status(400).json({
        error: [e],
      });
    }
  }

  async index(req, res) {
    try {
      const aluno = await _Alunos2.default.findAll({
        attributes: ['id', 'nome', 'email', 'altura', 'idade', 'peso'],
        order: [['id', 'DESC'], [_Foto2.default, 'id', 'DESC']], // Aqui você pode ordenar a visualização da tabela da forma como bem entender.
        include: {
          model: _Foto2.default,
          attributes: ['url', 'filename'],
        },
      });
      return res.json(aluno);
    } catch (e) {
      return res.json(null);
    }
  }

  async show(req, res) {
    try {
      if (!req.params.id) {
        return res.status(404).json({
          errors: ['Nenhuma ID foi enviado'],
        });
      }

      const findUser = await _Alunos2.default.findByPk(req.params.id, {
        attributes: ['id', 'nome', 'email', 'altura', 'idade', 'peso'],
        order: [['id', 'DESC'], [_Foto2.default, 'id', 'DESC']], // Aqui você pode ordenar a visualização da tabela da forma como bem entender.
        include: {
          model: _Foto2.default,
          attributes: ['url', 'filename'],
        },
      });
      return res.status(200).json(findUser);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async update(req, res) {
    // Verificar se pede o token a cada atualização de e-mail ou não.

    try {
      if (!req.params.id) { // Aqui você não vai mais receber um ID que o usuário manda no params, agora o update será feito pelo ID recebdio na validação do token do usuário. assim garantidndo que ele edite apenas o seu prórprio perfil quando necessário.
        return res.status(400).json({
          errors: ['ID não enviado'],
        });
      } // Fica até redundante realizar essa validação.

      const user = await _Alunos2.default.findByPk(req.params.id);

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

  async delete(req, res) {
    try {
      if (!req.params.id) {
        return res.status(404).json({
          errors: ['Nenhuma ID foi enviado'],
        });
      }

      const user = await _Alunos2.default.findByPk(req.params.id);

      if (!user) {
        return res.status(400).json({
          errros: ['Usuário não encontrado!'],
        });
      }

      await user.destroy();

      return res.status(200).json({
        succes: ['Usuário deletado com sucesso!'],
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

exports. default = new AlunoControllers();
