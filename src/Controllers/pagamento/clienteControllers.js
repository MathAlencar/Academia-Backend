import ClienteService from '../../services/pagamento/cliente_service.js';

class ClienteControllers {
  // Cadastra um cliente no Asaas
  async store(req, res) {
    try {
      const novoCliente = await ClienteService.cadastrarCliente(req.body);
      return res.status(201).json(novoCliente);
    } catch (e) {
      return res.status(400).json({
        errors: e.response?.data?.errors?.map((err) => err.description) || [e.message],
      });
    }
  }
}

export default new ClienteControllers();