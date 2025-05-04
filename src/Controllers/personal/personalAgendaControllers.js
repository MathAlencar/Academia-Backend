import PersonalAgendaModel from '../../Models/PersonalAgenda';
import Personal from '../../Models/Personal';

// Realizar a criação do Delete, store (somente);
// Não é necessário criar um SHOW, porque esse valor está sendo retornado junto com o show do Personal Trainer
class PersonalAgenda {
  async store(req, res) {
    try {
      const { personal_id } = req.body;

      const user = await Personal.findByPk(personal_id);

      if (!user) {
        return res.status(400).json({
          errors: ['Usuário não localizado'],
        });
      }

      console.log(req.body);

      const registerDate = await PersonalAgendaModel.create(req.body);

      return res.status(200).json(registerDate);
    } catch (e) {
      return res.status(400).json({
        errors: e.message,
      });
    }
  }

  async delete(req, res) {
    try {
      if (!req.params.id) {
        return res.status(404).json({
          errors: ['Nenhum ID foi enviado'],
        });
      }

      const agenda = await PersonalAgendaModel.findByPk(req.params.id);

      if (!agenda) {
        return res.status(404).json({
          errors: ['Nenhum registro foi localizado'],
        });
      }

      await agenda.destroy();

      return res.status(200).json({
        sucess: ['Registro excluido com sucesso!'],
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.message,
      });
    }
  }
}

export default new PersonalAgenda();
