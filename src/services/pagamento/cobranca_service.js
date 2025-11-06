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

// Cria uma cobrança no Asaas
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

function gerarCobranca(aluno, formaPagamento, valor, splitConfig = null) {
  const dataVencimento = gerarDataVencimentoCobranca();

  // Normaliza o formato
  const forma = formaPagamento?.toUpperCase();

  let cobrancaBase;

  switch (forma) {
    case 'PIX':
      cobrancaBase = gerarObjetoCobrancaPix(aluno, valor, dataVencimento);
      break;

    case 'BOLETO':
      cobrancaBase = gerarObjetoCobrancaBoleto(aluno, valor, dataVencimento);
      break;

    case 'CARTAO DE CREDITO':
      cobrancaBase = gerarObjetoCobrancaCartaoCredito(aluno, valor, dataVencimento);
      break;

    default:
      throw new Error(
        'Forma de cobrança inválida. Use PIX, BOLETO ou CARTAO DE CREDITO.'
      );
  }

  // Adiciona split se fornecido
  if (splitConfig) {
    cobrancaBase.split = splitConfig;
  }

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

function gerarObjetoCobrancaCartaoCredito(aluno, valor, dataVencimento) {
  return {
    customer: aluno.cliente_id,
    billingType: FormasPagamento.CREDIT_CARD,
    value: valor,
    dueDate: dataVencimento.toISOString().split('T')[0],
    description: 'Cobrança via cartão de crédito (pagamento será feito pelo link)',
  };
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
