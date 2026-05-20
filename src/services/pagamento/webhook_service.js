import Subconta from '../../Models/Subconta.js';  
import Cobrancas from '../../Models/Cobranca.js';  
import NotificacaoService from '../notificacao/notificacao_service.js';
  
const WebhookService = {  
  
  // POST /webhooks/asaas/account-status  
  async processarStatusConta(payload) {  
    const { event, account, accountStatus } = payload;
  
    if (!account || !account.id) {  
      throw new Error('Payload inválido: account.id ausente.');  
    }  
  
    const subconta = await Subconta.findOne({  
      where: { asaas_account_id: account.id },  
    });  
  
    if (!subconta) {  
      throw new Error(`Subconta não encontrada para account ${account.id}`);  
    }  
  
    // Mapeia status do Asaas (accountStatus.general) para status local
    const statusMap = {  
      AWAITING_APPROVAL: 'PENDENTE',  
      PENDING: 'PENDENTE',  
      AWAITING_ACTION_AUTHORIZATION: 'PENDENTE',  
      REJECTED: 'REJEITADO',  
      DENIED: 'REJEITADO',  
    };  
  
    // Fallback: deriva status a partir do nome do evento  
    const eventStatusMap = {  
      ACCOUNT_STATUS_GENERAL_APPROVAL_APPROVED: 'APROVADO',  
      ACCOUNT_STATUS_GENERAL_APPROVAL_REJECTED: 'REJEITADO',  
      ACCOUNT_STATUS_GENERAL_APPROVAL_AWAITING_APPROVAL: 'PENDENTE',  
    };  
  
    const generalStatus = accountStatus?.general;  
    const novoStatus = statusMap[generalStatus] || eventStatusMap[event] || null;
  
    if (novoStatus) {  
      const updates = { status_aprovacao: novoStatus };  
  
      if (novoStatus === 'APROVADO') {  
        updates.status_recebimento = 'HABILITADO';  
      } else if (novoStatus === 'REJEITADO') {  
        updates.status_recebimento = 'DESABILITADO';  
      }  
  
      await subconta.update(updates);
    } else {  
      console.warn(  
        `Status não mapeado para account ${account.id}. event=${event}, general=${generalStatus}`  
      );
    }  
  
    console.log(`Status conta ${account.id} atualizado: ${novoStatus}`);  
  },  
  
  // POST /webhooks/asaas/checkouts
  async processarCheckout(payload) {
    const { event, checkout } = payload;

    if (!checkout || !checkout.id) {
      throw new Error('Payload inválido: checkout.id ausente.');
    }

    const cobranca = await Cobrancas.findOne({
      where: { payment_link_id: checkout.id },
    });

    if (!cobranca) {
      console.log(`Cobrança não encontrada para checkout ${checkout.id}`);
      return;
    }

    const statusMap = {
      CHECKOUT_CREATED: 'PENDING',
      CHECKOUT_CANCELED: 'CANCELED',
      CHECKOUT_EXPIRED: 'EXPIRED',
      CHECKOUT_PAID: 'PAID',
    };

    const novoStatus = statusMap[event];
    if (!novoStatus) {
      console.warn(`Evento de checkout não mapeado: ${event}`);
      return;
    }

    const statusAnterior = cobranca.status;
    await cobranca.update({ status: novoStatus });

    if (event === 'CHECKOUT_PAID' && statusAnterior !== 'PAID') {
      await NotificacaoService.criarPagamentoAprovado(cobranca);
    }

    console.log(`Checkout ${checkout.id} atualizado: ${novoStatus}`);
  },
  
  // POST /webhooks/asaas/transfers  
  async processarTransferencia(payload) {  
    const { event, transfer } = payload;  
  
    console.log(`Transferência recebida - evento: ${event}, id: ${transfer?.id}`);  
  
    // Implementar conforme necessidade futura  
    // Ex: registrar transferências, atualizar saldos, etc.  
  },  
};  
  
export default WebhookService;
