import SubcontaService from '../../services/pagamento/subconta_service.js';

class SubcontaControllers {
  
  // Cria uma subconta no Asaas
 async store(req, res) {
    try {
      console.log('Corpo recebido pelo controller:', req.body);

      const novaSubconta = await SubcontaService.criarSubconta(req.body);

      return res.status(201).json({
        message: 'Subconta criada com sucesso.',
        data: novaSubconta
      });
    } catch (error) {
      console.error('Erro ao criar subconta:', error.message);

      return res.status(400).json({
        errors: [error.message]
      });
    }
  }

  // Atualiza os dados da subconta no Asaas e no banco
  async update(req, res) {
    try {
      const { personal_id } = req.params;
      console.log('Corpo recebido para atualização:', req.body);

      const subcontaAtualizada = await SubcontaService.atualizarSubconta(personal_id, req.body);

      return res.status(200).json({
        message: 'Subconta atualizada com sucesso.',
        data: subcontaAtualizada
      });
    } catch (error) {
      console.error('Erro ao atualizar subconta:', error.message);

      return res.status(400).json({
        errors: [error.message]
      });
    }
  }
}

export default new SubcontaControllers();