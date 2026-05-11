"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _Subcontajs = require('../../Models/Subconta.js'); var _Subcontajs2 = _interopRequireDefault(_Subcontajs);  
var _Cobrancajs = require('../../Models/Cobranca.js'); var _Cobrancajs2 = _interopRequireDefault(_Cobrancajs);  
  
const WebhookService = {  
  
  // POST /webhooks/asaas/account-status  
  async processarStatusConta(payload) {  
    const { event, account, accountStatus } = payload;
  
    if (!account || !account.id) {  
      throw new Error('Payload inválido: account.id ausente.');  
    }  
  
    const subconta = await _Subcontajs2.default.findOne({  
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
  
    const generalStatus = _optionalChain([accountStatus, 'optionalAccess', _ => _.general]);  
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
    const cobranca = await _Cobrancajs2.default.findOne({  
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
  
    console.log(`Transferência recebida - evento: ${event}, id: ${_optionalChain([transfer, 'optionalAccess', _2 => _2.id])}`);  
  
    // Implementar conforme necessidade futura  
    // Ex: registrar transferências, atualizar saldos, etc.  
  },  
};  
  
exports. default = WebhookService;