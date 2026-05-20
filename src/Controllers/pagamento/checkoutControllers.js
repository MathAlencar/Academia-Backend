import CheckoutService from '../../services/pagamento/checkout_service.js';  
import Subconta from '../../Models/Subconta.js';  
import Aluno from '../../Models/Alunos.js';  
import Plano from '../../Models/PlanosPersonal.js';  
import Cobrancas from '../../Models/Cobranca.js';  

function somenteDigitos(valor) {
  return String(valor || '').replace(/\D/g, '');
}

function montarCustomerDataAluno(aluno) {
  const customerData = {
    name: aluno.nome,
    email: aluno.email,
    cpfCnpj: somenteDigitos(aluno.cpf_cnpj),
    phone: somenteDigitos(aluno.celular),
  };

  return Object.fromEntries(
    Object.entries(customerData).filter(([, value]) => value),
  );
}
  
class CheckoutControllers {  
  async store(req, res) {  
    try {  
      const {
        planoId,
        billingTypes,
        chargeTypes,
        callback,
        customer,
        customerData,
        usarDadosAluno = false,
      } = req.body;
      const alunoId = req.userID;
  
      if (!planoId) {  
        return res.status(400).json({  
          errors: ['Campo obrigatório: planoId.'],  
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
  
      if (!subconta || !subconta.wallet_id) {  
        return res.status(400).json({  
          errors: ['Personal não possui subconta/carteira configurada no Asaas.'],  
        });  
      }  
  
      // 4. Criar checkout no Asaas
      const nomeCheckout = `${plano.tipo_plano} - Plano #${plano.id}`;  
      const checkoutCustomerData =
        customerData || (usarDadosAluno ? montarCustomerDataAluno(aluno) : null);
      const checkout = await CheckoutService.criarCheckout({
        nome: nomeCheckout,
        descricao: `Contratacao do plano ${plano.tipo_plano}`,
        valor: plano.valor,
        carteiraIdPersonal: subconta.wallet_id,
        percentualPersonal: 90,
        billingTypes,
        chargeTypes,
        externalReference: `aluno:${alunoId}|plano:${planoId}`,
        callback,
        customer,
        customerData: customer ? null : checkoutCustomerData,
      });
  
      // 5. Salvar registro na tabela Cobrancas  
      const cobranca = await Cobrancas.create({  
        aluno_id: alunoId,  
        plano_id: planoId,  
        payment_link_id: checkout.id,  
        checkout_url: checkout.checkoutUrl,  
        status: 'PENDING',  
        value: plano.valor,  
      });  
  
      // 6. Retornar URL do checkout ao frontend  
      return res.status(201).json({  
        cobranca_id: cobranca.id,  
        checkout_id: checkout.id,
        checkout_url: checkout.checkoutUrl,
        payment_link_id: checkout.id,
        status: checkout.status,
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

  async show(req, res) {
    try {
      const { id } = req.params;
      const checkout = await CheckoutService.consultarCheckout(id);

      return res.status(200).json(checkout);
    } catch (e) {
      return res.status(400).json({
        errors:
          e.response?.data?.errors?.map((err) => err.description) ||
          [e.message],
      });
    }
  }
}  
  
export default new CheckoutControllers();
