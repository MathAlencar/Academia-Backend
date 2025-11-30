import ClienteService from '../../services/pagamento/cliente_service.js';
import Alunos from '../../Models/Alunos.js';

class ClienteControllers {
  // Cadastra um cliente no Asaas
  async store(req, res) {
    try {
      const novoCliente = await ClienteService.cadastrarCliente(req.body);

      // Encontrando o e-mail do aluno
      const aluno = await Alunos.findOne({
        where: {
          email: novoCliente?.email,
        }
      })

      if(aluno) {
        await aluno.update({
          cliente_id: novoCliente?.id
        })
      }

      return res.status(201).json(novoCliente);

    } catch (e) {
      return res.status(400).json({
        errors: e.response?.data?.errors?.map((err) => err.description) || [e.message],
      });
    }
  }
}

export default new ClienteControllers();
