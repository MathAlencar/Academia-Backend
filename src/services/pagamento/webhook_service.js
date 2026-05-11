import Subconta from '../../Models/Subconta.js';  
import Cobrancas from '../../Models/Cobranca.js';  
  
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
  
  // POST /webhooks/asaas/payments  
  async processarPagamento(payload) {  
    const { event, payment } = payload;  
  
    if (!payment || !payment.id) {  
      throw new Error('Payload inválido: payment.id ausente.');  
    }  
  
    // Atualizar status da cobrança local com base no evento  
    // Ajuste os campos conforme a estrutura real do payload do Asaas  
    const cobranca = await Cobrancas.findOne({  
      where: { payment_link_id: payment.id },  
    });  
  
    if (!cobranca) {  
      console.log(`Cobrança não encontrada para payment ${payment.id}`);  
      return;  
    }  
  
    // Mapear eventos do Asaas para status local  
    const statusMap = {  
      PAYMENT_CONFIRMED: 'CONFIRMED',  
      PAYMENT_RECEIVED: 'RECEIVED',  
      PAYMENT_OVERDUE: 'OVERDUE',  
      PAYMENT_REFUNDED: 'REFUNDED',  
      PAYMENT_DELETED: 'DELETED',  
      PAYMENT_UPDATED: 'UPDATED',  
    };  
  
    const novoStatus = statusMap[event];  
  
    if (novoStatus) {  
      await cobranca.update({ status: novoStatus });  
      console.log(`Cobrança ${payment.id} atualizada: ${novoStatus}`);  
    }  
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