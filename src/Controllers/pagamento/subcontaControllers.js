import SubcontaService from '../../services/pagamento/subconta_service.js';  
  
class SubcontaControllers {  

  async showMe(req, res) {
    try {
      const personalId = req.userID;

      const subconta = await SubcontaService.consultarMinhaSubconta(personalId);

      return res.status(200).json({
        message: subconta ? 'Subconta encontrada.' : 'Personal ainda não possui subconta.',
        data: subconta,
      });
    } catch (error) {
      console.error('Erro ao consultar subconta:', error.message);

      return res.status(400).json({
        errors: [error.message],
      });
    }
  }
  
  async store(req, res) {  
    try {  
      const personalId = req.userID;  
  
      const novaSubconta = await SubcontaService.criarSubconta(personalId, req.body); 
  
      return res.status(201).json({  
        message: 'Subconta criada com sucesso.',  
        data: novaSubconta,
      }); 
    } catch (error) {  
      console.error('Erro ao criar subconta:', error.message);  
  
      return res.status(400).json({  
        errors: [error.message],  
      });  
    }  
  }  
  
  async update(req, res) {  
    try {  
      const personalId = req.userID;

      const subcontaAtualizada = await SubcontaService.atualizarSubconta(personalId, req.body);

      return res.status(200).json({  
        message: 'Subconta atualizada com sucesso.',  
        data: subcontaAtualizada,  
      });  
    } catch (error) {  
      console.error('Erro ao atualizar subconta:', error.message);  
  
      return res.status(400).json({  
        errors: [error.message],  
      });  
    }  
  }  
}  
  
export default new SubcontaControllers();
