import CobrancaService from '../../services/pagamento/cobranca_service.js';  
import Subconta from '../../Models/Subconta.js';  
import Aluno from '../../Models/Alunos.js';  
import Plano from '../../Models/PlanosPersonal.js';  
import Cobrancas from '../../Models/Cobranca.js';  
  
class CobrancaControllers {  
  
  async store(req, res) {  
    try {  
      const { alunoId, planoId, dadosCartao } = req.body;  
      let { forma } = req.body;  
  
      forma = typeof forma === 'string' ? forma.toUpperCase() : null;  
  
      if (!forma) {  
        return res.status(400).json({  
          errors: ['Forma de pagamento não informada.'],  
        });  
      }  
  
      const aluno = await Aluno.findByPk(alunoId);  
      if (!aluno) {  
        return res.status(404).json({  
          errors: ['Aluno não encontrado.'],  
        });  
      }  
  
      const plano = await Plano.findByPk(planoId);  
      if (!plano) {  
        return res.status(404).json({  
          errors: ['Plano não encontrado.'],  
        });  
      }  
  
      const subconta = await Subconta.findOne({  
        where: { personal_id: plano.personal_id },  
      });  
  
      if (!subconta) {  
        return res.status(404).json({  
          errors: ['Subconta do personal não encontrada.'],  
        });  
      }  
  
      if (!subconta.wallet_id) {  
        return res.status(400).json({  
          errors: ['Personal não possui wallet_id configurado.'],  
        });  
      }  
  
      const splitConfig = [  
        {  
          walletId: subconta.wallet_id,  
          percentualValue: 95.0,  
        },  
      ];  
  
      const cobranca = await CobrancaService.criarCobranca(  
        aluno,  
        forma,  
        plano.valor,  
        splitConfig,  
        dadosCartao  
      );  
  
      await Cobrancas.create({  
        aluno_id: alunoId,  
        plano_id: planoId,  
      });  
  
      return res.status(201).json(cobranca);  
    } catch (e) {  
      console.error('Erro ao criar cobrança:', e);  
  
      return res.status(400).json({  
        errors:  
          e.response?.data?.errors?.map((err) => err.description) ||  
          [e.message],  
      });  
    }  
  }  
  
  async show(req, res) {  
    try {  
      const { id } = req.params;  
      const cobranca = await CobrancaService.consultarCobranca(id);  
  
      if (!cobranca || !cobranca.id) {  
        return res.status(404).json({  
          errors: ['Cobrança não encontrada no Asaas'],  
        });  
      }  
  
      return res.status(200).json(cobranca);  
    } catch (e) {  
      return res.status(400).json({  
        errors:  
          e.response?.data?.errors?.map((err) => err.description) ||  
          [e.message],  
      });  
    }  
  }  
}  
  
export default new CobrancaControllers();