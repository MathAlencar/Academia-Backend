import { Op } from 'sequelize';
import AulaAgenda from '../../Models/AgendaAulas';
import PersonalAgenda from '../../Models/PersonalAgenda';

// Não é necessário criar um SHOW e nem INDEX, porque esse valor está sendo retornado junto com o SHOW/INDEX do Personal Trainer e no Aluno;
// Sendo necessário somente as API's de alteração de estados

class AgendaControllers {
  async store(req, res) {
    try {
      const {
        personal_id, date_init, date_end,
      } = req.body;

      const restricao = await PersonalAgenda.findOne({
        where: {
          personal_id,
          [Op.and]: [
            { date_init: { [Op.lte]: date_end } },
            { date_end: { [Op.gte]: date_init } },
          ],
        },
        attributes: ['title', 'date_init', 'date_end'],
      });

      if (restricao) {
        return res.status(404).json({
          errors: ['Professor indisponível neste horário'],
          agenda: conflito,
        });
      }

      const conflito = await AulaAgenda.findOne({
        where: {
          personal_id,
          [Op.and]: [
            { date_init: { [Op.lte]: date_end } },
            { date_end: { [Op.gte]: date_init } },
          ],
        },
        attributes: ['id', 'status', 'date_init', 'date_end', 'endereco'],
      });

      if (conflito && conflito.dataValues.status === 'aceita') {
        return res.status(404).json({
          errors: ['Já existe um horário marcado com este personal nesta data'],
        });
      }

      const aula = await AulaAgenda.create(req.body);

      return res.status(200).json(aula);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async delete(req, res) {
    try {
      if (!req.params.id) {
        return res.status(200).json({
          errors: ['Nenhuma chave foi enviada'],
        });
      }

      const aula = await AulaAgenda.findByPk(req.params.id);

      if (!aula) {
        return res.status(404).json({
          errors: ['Aula não localizada'],
        });
      }

      await aula.destroy();

      return res.status(200).json({
        success: ['Aula exclúida com sucesso'],
      });
    } catch (e) {
      return res.status(404).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  // Somente irá receber a alteração de status
  async update(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          errors: ['Chave não enviada para update'],
        });
      }

      const aula = await AulaAgenda.findByPk(req.params.id);

      if (!aula) {
        return res.status(400).json({
          errors: ['Aula não encontrado'],
        });
      }

      const novosDados = await aula.update(req.body);

      return res.status(200).json(novosDados);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }
}

export default new AgendaControllers();
