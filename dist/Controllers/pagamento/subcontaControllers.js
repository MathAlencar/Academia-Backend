"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _subconta_servicejs = require('../../services/pagamento/subconta_service.js'); var _subconta_servicejs2 = _interopRequireDefault(_subconta_servicejs);

class SubcontaControllers {

  // Cria uma subconta no Asaas
 async store(req, res) {
    try {
      console.log('Corpo recebido pelo controller:', req.body);

      const novaSubconta = await _subconta_servicejs2.default.criarSubconta(req.body);

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

      const subcontaAtualizada = await _subconta_servicejs2.default.atualizarSubconta(personal_id, req.body);

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

exports. default = new SubcontaControllers();
