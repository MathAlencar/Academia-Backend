import PlanoTreino from "../../Models/planoTreino";
import Alunos from "../../Models/Alunos";
import Personal from "../../Models/Personal";
import SessaoTreino from '../../Models/sessaoTreino';
import ExercicioPersonal from "../../Models/ExercicioPersonal";
import itemExercicio from "../../Models/itemExercicio";
import videoExercicio from '../../Models/videoExercicio';


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
      const validacao = await PlanoTreino.findAll({
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

      const newPlanTraining = await PlanoTreino.create(body);

      return res.status(200).json(newPlanTraining);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
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

      const planoTreino = await PlanoTreino.findOne({
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

      if(req.body?.status == 'Ativo'){
        const aluno_id_validate = planoTreino.dataValues.aluno_id;

        // Realizando a busca nos planos do aluno.
        const validacao = await PlanoTreino.findAll({
          where: {
            aluno_id: aluno_id_validate,
            status: 'Ativo'
          },
        })

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
        errors: e.errors?.map((err) => err.message) || [e.message],
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

      const planoTreino = await PlanoTreino.findOne({
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
        errors: e.errors?.map((err) => err.message) || [e.message],
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

      const personal = await Personal.findOne({
        where: {
          id: req.userID,
          email: req.userEmail
        }
      })

      const aluno = await Alunos.findOne({
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
            model: SessaoTreino,
            attributes: ['id', 'identificador', 'titulo', 'ordem'],
            order: [['id', 'DESC']],
            include: [
              {
                model: itemExercicio,
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
                    model: ExercicioPersonal,
                    attributes: ['id', 'personal_id', 'nome', 'grupo_muscular', 'descricao'],
                    include: [
                      {
                        model: videoExercicio,
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
        result = await PlanoTreino.findOne({
          where: {
            id: req.params.id,
            aluno_id: req.userID
          },
          ...options
        })
      }

      if(personal){
        result = await PlanoTreino.findOne({
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
        errors: e.errors?.map((err) => err.message) || [e.message],
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

      const personal = await Personal.findOne({
        where: {
          id: req.userID,
          email: req.userEmail
        }
      })

      const aluno = await Alunos.findOne({
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
            model: SessaoTreino,
            attributes: ['id', 'identificador', 'titulo', 'ordem'],
            order: [['id', 'DESC']],
            include: [
              {
                model: itemExercicio,
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
                    model: ExercicioPersonal,
                    attributes: ['id', 'personal_id', 'nome', 'grupo_muscular', 'descricao'],
                  }
                ]
              }
            ]
          }
        ]
      };

      if(aluno){
        result = await PlanoTreino.findAll({
          where: {
            aluno_id: req.userID
          },
          ...options
        })
      }

      if(personal){
        result = await PlanoTreino.findAll({
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
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }

  }

}

export default new PlanoTreinoControllers();
