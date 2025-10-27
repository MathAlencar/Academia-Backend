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

   // Consulta cliente por CPF/CNPJ
  // Exemplo: GET /clientes/consulta/12345678900
  async show(req, res) {
    try {
      const { cpfCnpj } = req.params;
      const cliente = await ClienteService.consultarCliente(cpfCnpj);

      if (!cliente || !cliente.data?.length) {
        return res.status(404).json({
          errors: ['Cliente não encontrado no Asaas'],
        });
      }

      return res.status(200).json(cliente.data[0]);
    } catch (e) {
      return res.status(400).json({
        errors: e.response?.data?.errors?.map((err) => err.description) || [e.message],
      });
    }
  }

   // Lista todos os clientes (opcional)
  // Exemplo: GET /clientes
//   async index(req, res) {
//     try {
//       const response = await ClienteService.listarClientes();
//       return res.status(200).json(response.data);
//     } catch (e) {
//       return res.status(400).json({
//         errors: e.response?.data?.errors?.map((err) => err.description) || [e.message],
//       });
//     }
//   }

   // Atualiza dados de um cliente existente no Asaas
  // Exemplo: PUT /clientes/:id
//   async update(req, res) {
//     try {
//       const { id } = req.params;
//       const response = await ClienteService.atualizarCliente(id, req.body);
//       return res.status(200).json(response);
//     } catch (e) {
//       return res.status(400).json({
//         errors: e.response?.data?.errors?.map((err) => err.description) || [e.message],
//       });
//     }
//   }
}

export default new ClienteControllers();