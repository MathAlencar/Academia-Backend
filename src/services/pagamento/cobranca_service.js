import 'dotenv/config.js';
import axios from 'axios';
import { FormasPagamento } from '../../enums/formas_pagamento.js';

const ASAAS_TOKEN = process.env.ASAAS_TOKEN;
const ASAAS_API_URL = process.env.ASAAS_API_URL;
const ASAAS_PRAZO_PAGTO_DIAS = process.env.ASAAS_PRAZO_PAGTO_DIAS || 15;

const axiosInstance = axios.create({
  baseURL: ASAAS_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'access_token': ASAAS_TOKEN
  }
});

/**
 * Cria uma cobrança no Asaas
 * @param {object} dadosCobranca - Dados da cobrança conforme documentação Asaas
 * @returns {object} Resposta da API com dados da cobrança criada
 */
async function criarCobranca(aluno, formas_pagamento, valor, splitConfig = null, dadosCartao = null) {
  try {
    const body = gerarCobranca(aluno, formas_pagamento, valor, splitConfig, dadosCartao);
    const response = await axiosInstance.post('/payments', body);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar cobrança:', error.response ? error.response.data : error.message);
    throw error;
  }
}

function gerarDataVencimentoCobranca() {
    let dataVencimento = new Date();
    dataVencimento.setDate(dataVencimento.getDate() + ASAAS_PRAZO_PAGTO_DIAS);
    return dataVencimento;
}

function gerarCobranca(aluno, formas_pagamento, valor, splitConfig = null, dadosCartao = null) {
  const dataVencimento = gerarDataVencimentoCobranca();

  let cobrancaBase;

  switch (formas_pagamento) {
    case FormasPagamento.PIX:
      cobrancaBase = gerarObjetoCobrancaPix(aluno, valor, dataVencimento);
      break;
    case FormasPagamento.BOLETO:
      cobrancaBase = gerarObjetoCobrancaBoleto(aluno, valor, dataVencimento);
      break;
    case FormasPagamento.CREDIT_CARD:
      cobrancaBase = gerarObjetoCobrancaCartaoCredito(aluno, valor, dataVencimento, dadosCartao);
      break;
    default:
      throw new Error('Forma de cobrança inválida');
  }

  // Adiciona configuração de split se fornecida
  if (splitConfig) {
    cobrancaBase.split = splitConfig;
  }

  // Retorna o objeto de cobrança completo
  return cobrancaBase;
}

function gerarObjetoCobrancaPix(aluno, valor, dataVencimento) {
  return {
    customer: aluno.cliente_id,
    billingType: FormasPagamento.PIX,
    value: valor,
    dueDate: dataVencimento.toISOString().split('T')[0]
  };
}

function gerarObjetoCobrancaBoleto(aluno, valor, dataVencimento) {
  return {
    customer: aluno.cliente_id,
    billingType: FormasPagamento.BOLETO,
    value: valor,
    dueDate: dataVencimento.toISOString().split('T')[0]
  };
}

function gerarObjetoCobrancaCartaoCredito(aluno, valor, dataVencimento, dadosCartao) {
  if (!dadosCartao?.creditCard || !dadosCartao?.creditCardHolderInfo) {
    throw new Error('Dados do cartão de crédito são obrigatórios para cobranças com CREDIT_CARD.');
  }

  return {
    customer: aluno.cliente_id,
    billingType: FormasPagamento.CREDIT_CARD,
    value: valor,
    dueDate: dataVencimento.toISOString().split('T')[0],
    creditCard: {
        holderName: dadosCartao.creditCard.holderName,
        number: dadosCartao.creditCard.number,
        expiryMonth: dadosCartao.creditCard.expiryMonth,
        expiryYear: dadosCartao.creditCard.expiryYear,
        ccv: dadosCartao.creditCard.ccv
    },
    creditCardHolderInfo: {
        name: dadosCartao.creditCardHolderInfo.name,
        email: dadosCartao.creditCardHolderInfo.email,
        cpfCnpj: dadosCartao.creditCardHolderInfo.cpfCnpj,
        postalCode: dadosCartao.creditCardHolderInfo.postalCode,
        addressNumber: dadosCartao.creditCardHolderInfo.addressNumber,
        mobilePhone: dadosCartao.creditCardHolderInfo.mobilePhone
    }
 }
}

async function consultarCobranca(id) {
  try {
    const response = await axiosInstance.get(`/payments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao consultar cobrança:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export default {
  criarCobranca,
  consultarCobranca
};


// /**
//  * Exemplo de dados para cobrança em cartão de crédito
//  */
// const cobrancaCartao = {
//   customer: 'ID_DO_CLIENTE',
//   billingType: 'CREDIT_CARD', // Para cartão de crédito
//   value: 150.00,
//   dueDate: '2025-11-30',
//   creditCard: {
//     holderName: 'Nome do Titular',
//     number: '4111111111111111',
//     expiryMonth: '12',
//     expiryYear: '2026',
//     ccv: '123',
//     cpf: '12345678900' // CPF do titular do cartão
//   }
// };

// /**
//  * Exemplo de dados para cobrança com boleto
//  */
// const cobrancaBoleto = {
//   customer: 'ID_DO_CLIENTE',
//   billingType: 'BOLETO', // Para boleto bancário
//   value: 200.00,
//   dueDate: '2025-11-30'
// };

// /**
//  * Exemplo de dados para cobrança com PIX
//  */
// const cobrancaPix = {
//   customer: 'ID_DO_CLIENTE',
//   billingType: 'PIX', // Para PIX
//   value: 100.00,
//   dueDate: '2025-11-30'
// };