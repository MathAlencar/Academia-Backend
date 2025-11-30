"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _planoTreino = require('../../Models/planoTreino'); var _planoTreino2 = _interopRequireDefault(_planoTreino);
var _Alunos = require('../../Models/Alunos'); var _Alunos2 = _interopRequireDefault(_Alunos);
var _Personal = require('../../Models/Personal'); var _Personal2 = _interopRequireDefault(_Personal);
var _sessaoTreino = require('../../Models/sessaoTreino'); var _sessaoTreino2 = _interopRequireDefault(_sessaoTreino);
var _ExercicioPersonal = require('../../Models/ExercicioPersonal'); var _ExercicioPersonal2 = _interopRequireDefault(_ExercicioPersonal);
var _itemExercicio = require('../../Models/itemExercicio'); var _itemExercicio2 = _interopRequireDefault(_itemExercicio);
var _videoExercicio = require('../../Models/videoExercicio'); var _videoExercicio2 = _interopRequireDefault(_videoExercicio);


class PlanoTreinoControllers {

  async store(req, res) {
    try {

      const { nome, data_inicio, data_fim, status, observacoes_gerais } = req.body;

      const body = {
        aluno_id: req.params.id,
        personal_id: req.userID,
        nome,
        data_inicio,
        data_fim,
        status,
        observacoes_gerais,
      }

      // Realizando a busca nos planos do aluno.
      const validacao = await _planoTreino2.default.findAll({
        where: {
          aluno_id: req.params.id,
          status: 'Ativo'
        },
      })


      // Usuário não pode ter mais de 2 planos ativos.
      if(validacao.length > 0 && status == "Ativo") {
        return res.status(404).json({
          errors: ['Já existe um plano ativo vinculado a este aluno.']
        });
      }

      const newPlanTraining = await _planoTreino2.default.create(body);

      return res.status(200).json(newPlanTraining);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _ => _.errors, 'optionalAccess', _2 => _2.map, 'call', _3 => _3((err) => err.message)]) || [e.message],
      });
    }
  }

  // Caso tiver no body, a chave "Status" ele irá verificar se existe algum plano já ativo, caso contrário será possível realizar o update.
  async update(req, res) {
    try {

      if (!req.params.id) {
        return res.status(400).json({
          errors: ['Chave não enviada para update'],
        });
      }

      if(!req.userID){
        return res.status(401).json({
          message: ['Token não enviado!']
        })
      }

      const planoTreino = await _planoTreino2.default.findOne({
        where: {
          id: req.params.id,
          personal_id: req.userID, // ou o nome da FK conforme sua tabela
        },
      });

      if (!planoTreino) {
        return res.status(400).json({
          errors: ['plano Treino não encontrado'],
        });
      }

      if(_optionalChain([req, 'access', _4 => _4.body, 'optionalAccess', _5 => _5.status]) == 'Ativo'){
        const aluno_id_validate = planoTreino.dataValues.aluno_id;

        // Realizando a busca nos planos do aluno.
        const validacao = await _planoTreino2.default.findAll({
          where: {
            aluno_id: aluno_id_validate,
            status: 'Ativo'
          },
        })

        console.log();

        if(validacao.length > 0) {

          const msg = validacao[0].dataValues.id == planoTreino.dataValues.id ? "Este plano já está ativo!" : 'Já existe um plano ativo vinculado a este aluno.';

          return res.status(404).json({
            errors: [msg]
          });
        }
      }

      const newPlanoTreino = await planoTreino.update(req.body);

      return res.status(200).json(newPlanoTreino);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _6 => _6.errors, 'optionalAccess', _7 => _7.map, 'call', _8 => _8((err) => err.message)]) || [e.message],
      });
    }
  }

  async delete(req, res) {
    try {

      if (!req.params.id) {
        return res.status(400).json({
          errors: ['Chave não enviada para update'],
        });
      }

      if(!req.userID){
        return res.status(401).json({
          message: ['Token não enviado!']
        })
      }

      const planoTreino = await _planoTreino2.default.findOne({
        where: {
          id: req.params.id,
          personal_id: req.userID, // ou o nome da FK conforme sua tabela
        },
      });

      if (!planoTreino) {
        return res.status(400).json({
          errors: ['plano Treino não encontrado'],
        });
      }

      await planoTreino.destroy();

      return res.status(200).json({
        message: ['Excluido com sucesso!']
      });
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _9 => _9.errors, 'optionalAccess', _10 => _10.map, 'call', _11 => _11((err) => err.message)]) || [e.message],
      });
    }
  }

  // Irá retornar somente de um único treino de um aluno.
  async indexOne(req,res){
    try {

      if(!req.userID){
        return res.status(401).json({
          message: ['Token não enviado!']
        })
      }

      const personal = await _Personal2.default.findOne({
        where: {
          id: req.userID,
          email: req.userEmail
        }
      })

      const aluno = await _Alunos2.default.findOne({
        where: {
          id: req.userID,
          email: req.userEmail
        }
      })

      if(!req.params.id){
        return res.status(401).json({
          message: ['ID do plano não enviado!']
        })
      }

      let result;

      const options = {
        order: [['id', 'DESC']],
        include: [
          {
            model: _sessaoTreino2.default,
            attributes: ['id', 'identificador', 'titulo', 'ordem'],
            order: [['id', 'DESC']],
            include: [
              {
                model: _itemExercicio2.default,
                attributes: [
                  'id',
                  'sessao_treino_id',
                  'exercicio_personal_id',
                  'ordem',
                  'series',
                  'repeticoes',
                  'tempo_descanso_segundos',
                  'observacoes'
                ],
                include: [
                  {
                    model: _ExercicioPersonal2.default,
                    attributes: ['id', 'personal_id', 'nome', 'grupo_muscular', 'descricao'],
                    include: [
                      {
                        model: _videoExercicio2.default,
                        attributes: ['url', 'filename'],
                        order: [['id', 'DESC']],
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };

      if(aluno){
        result = await _planoTreino2.default.findOne({
          where: {
            id: req.params.id,
            aluno_id: req.userID
          },
          ...options
        })
      }

      if(personal){
        result = await _planoTreino2.default.findOne({
          where: {
            id: req.params.id,
            personal_id: req.userID
          },
          ...options
        })
      }

      if (!result) {
        return res.status(400).json({
          errors: ['plano Treino não encontrado'],
        });
      }

      return res.status(200).json({
        result
      })

    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _12 => _12.errors, 'optionalAccess', _13 => _13.map, 'call', _14 => _14((err) => err.message)]) || [e.message],
      });
    }

  }

  // Irá retornar todos os treinos vinculados aquele aluno, se caso for personal, todos os treinos que o personal tem para aquele aluno, caso contrátio será todos os treinos do aluno independente do personal.
  async index(req,res){
    try {

      if(!req.userID){
        return res.status(401).json({
          message: ['Token não enviado!']
        })
      }

      const personal = await _Personal2.default.findOne({
        where: {
          id: req.userID,
          email: req.userEmail
        }
      })

      const aluno = await _Alunos2.default.findOne({
        where: {
          id: req.userID,
          email: req.userEmail
        }
      })

      if(!req.params.id){
        return res.status(401).json({
          message: ['ID do plano não enviado!']
        })
      }

      let result;

      const options = {
        order: [['id', 'DESC']],
        include: [
          {
            model: _sessaoTreino2.default,
            attributes: ['id', 'identificador', 'titulo', 'ordem'],
            order: [['id', 'DESC']],
            include: [
              {
                model: _itemExercicio2.default,
                attributes: [
                  'id',
                  'sessao_treino_id',
                  'exercicio_personal_id',
                  'ordem',
                  'series',
                  'repeticoes',
                  'tempo_descanso_segundos',
                  'observacoes'
                ],
                include: [
                  {
                    model: _ExercicioPersonal2.default,
                    attributes: ['id', 'personal_id', 'nome', 'grupo_muscular', 'descricao'],
                  }
                ]
              }
            ]
          }
        ]
      };

      if(aluno){
        result = await _planoTreino2.default.findAll({
          where: {
            aluno_id: req.userID
          },
          ...options
        })
      }

      if(personal){
        result = await _planoTreino2.default.findAll({
          where: {
            personal_id: req.userID,
            aluno_id: req.params.id
          },
          ...options
        })
      }

       if (result.length == 0) {
        return res.status(400).json({
          errors: ['planos de treino não encontrado'],
        });
      }

      return res.status(200).json({
        result
      })

    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _15 => _15.errors, 'optionalAccess', _16 => _16.map, 'call', _17 => _17((err) => err.message)]) || [e.message],
      });
    }

  }

}

exports. default = new PlanoTreinoControllers();
