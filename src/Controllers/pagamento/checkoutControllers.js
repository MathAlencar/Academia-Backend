import CheckoutService from '../../services/pagamento/checkout_service.js';  
import Subconta from '../../Models/Subconta.js';  
import Aluno from '../../Models/Alunos.js';  
import Plano from '../../Models/PlanosPersonal.js';  
import Cobrancas from '../../Models/Cobranca.js';  
  
class CheckoutControllers {  
  async store(req, res) {  
    try {  
      const { alunoId, planoId } = req.body;  
  
      if (!alunoId || !planoId) {  
        return res.status(400).json({  
          errors: ['Campos obrigatórios: alunoId e planoId.'],  
        });  
      }  
  
      // 1. Buscar aluno (validar existência)  
      const aluno = await Aluno.findByPk(alunoId);  
      if (!aluno) {  
        return res.status(404).json({  
          errors: ['Aluno não encontrado.'],  
        });  
      }  
  
      // 2. Buscar plano (obter valor e personal_id)  
      const plano = await Plano.findByPk(planoId);  
      if (!plano) {  
        return res.status(404).json({  
          errors: ['Plano não encontrado.'],  
        });  
      }  
  
      // 3. Buscar subconta do personal (obter carteira_id para split)  
      const subconta = await Subconta.findOne({  
        where: { personal_id: plano.personal_id },  
      });  
  
      if (!subconta || !subconta.carteira_id) {  
        return res.status(400).json({  
          errors: ['Personal não possui subconta/carteira configurada no Asaas.'],  
        });  
      }  
  
      // 4. Criar checkout no Asaas (sem customer, sem customerData)  
      const nomeCheckout = `${plano.tipo_plano} - Plano #${plano.id}`;  
      const checkout = await CheckoutService.criarCheckout(  
        nomeCheckout,  
        plano.valor,  
        subconta.carteira_id,  
      );  
  
      // 5. Salvar registro na tabela Cobrancas  
      const cobranca = await Cobrancas.create({  
        aluno_id: alunoId,  
        plano_id: planoId,  
        payment_link_id: checkout.id,  
        checkout_url: checkout.url,  
        status: 'PENDING',  
        value: plano.valor,  
      });  
  
      // 6. Retornar URL do checkout ao frontend  
      return res.status(201).json({  
        cobranca_id: cobranca.id,  
        checkout_url: checkout.url,  
        payment_link_id: checkout.id,  
      });  
    } catch (e) {  
      console.error('Erro ao criar checkout:', e);  
  
      return res.status(400).json({  
        errors:  
          e.response?.data?.errors?.map((err) => err.description) ||  
          [e.message],  
      });  
    }  
  }  
}  
  
export default new CheckoutControllers();