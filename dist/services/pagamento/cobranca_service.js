"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }require('dotenv/config.js');
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);
var _formas_pagamentojs = require('../../enums/formas_pagamento.js');

const ASAAS_TOKEN = process.env.ASAAS_TOKEN;
const ASAAS_API_URL = process.env.ASAAS_API_URL;
const ASAAS_PRAZO_PAGTO_DIAS = process.env.ASAAS_PRAZO_PAGTO_DIAS || 15;

const axiosInstance = _axios2.default.create({
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
  const forma = _optionalChain([formaPagamento, 'optionalAccess', _ => _.toUpperCase, 'call', _2 => _2()]);

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
    billingType: _formas_pagamentojs.FormasPagamento.PIX,
    value: valor,
    dueDate: dataVencimento.toISOString().split('T')[0]
  };
}

function gerarObjetoCobrancaBoleto(aluno, valor, dataVencimento) {
  return {
    customer: aluno.cliente_id,
    billingType: _formas_pagamentojs.FormasPagamento.BOLETO,
    value: valor,
    dueDate: dataVencimento.toISOString().split('T')[0]
  };
}

function gerarObjetoCobrancaCartaoCredito(aluno, valor, dataVencimento) {
  return {
    customer: aluno.cliente_id,
    billingType: _formas_pagamentojs.FormasPagamento.CREDIT_CARD,
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

exports. default = {
  criarCobranca,
  consultarCobranca
};
