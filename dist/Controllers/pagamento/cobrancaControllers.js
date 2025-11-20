"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _cobranca_servicejs = require('../../services/pagamento/cobranca_service.js'); var _cobranca_servicejs2 = _interopRequireDefault(_cobranca_servicejs);
var _Subcontajs = require('../../Models/Subconta.js'); var _Subcontajs2 = _interopRequireDefault(_Subcontajs);
var _Alunosjs = require('../../Models/Alunos.js'); var _Alunosjs2 = _interopRequireDefault(_Alunosjs);
var _PlanosPersonaljs = require('../../Models/PlanosPersonal.js'); var _PlanosPersonaljs2 = _interopRequireDefault(_PlanosPersonaljs);

class CobrancaControllers {

  // Cria uma cobrança no Asaas
async store(req, res) {
  try {
    const { alunoId, planoId, dadosCartao } = req.body;
    let { forma } = req.body;

    // Normaliza a forma de pagamento (case-insensitive)
    forma = typeof forma === 'string' ? forma.toUpperCase() : null;

    if (!forma) {
      return res.status(400).json({
        errors: ['Forma de pagamento não informada.'],
      });
    }

    // Buscar aluno
    const aluno = await _Alunosjs2.default.findByPk(alunoId);
    if (!aluno) {
      return res.status(404).json({
        errors: ['Aluno não encontrado.'],
      });
    }

    if (!aluno.cliente_id) {
      return res.status(400).json({
        errors: ['Aluno não possui cliente_id configurado no Asaas.'],
      });
    }

    // Buscar plano
    const plano = await _PlanosPersonaljs2.default.findByPk(planoId);
    if (!plano) {
      return res.status(404).json({
        errors: ['Plano não encontrado.'],
      });
    }

    // Buscar subconta do personal
    const subconta = await _Subcontajs2.default.findOne({
      where: { personal_id: plano.personal_id },
    });

    if (!subconta) {
      return res.status(404).json({
        errors: ['Subconta do personal não encontrada.'],
      });
    }

    if (!subconta.carteira_id) {
      return res.status(400).json({
        errors: ['Personal não possui carteira_id configurado.'],
      });
    }

    // Montar split automático
    const splitConfig = [
      {
        walletId: subconta.carteira_id,
        percentualValue: 95.0,
      },
    ];

    // Criar cobrança no Asaas
    const cobranca = await _cobranca_servicejs2.default.criarCobranca(
      aluno,
      forma,
      plano.valor,
      splitConfig,
      dadosCartao
    );

    return res.status(201).json(cobranca);
  } catch (e) {
    console.error('Erro ao criar cobrança:', e);

    return res.status(400).json({
      errors:
        _optionalChain([e, 'access', _ => _.response, 'optionalAccess', _2 => _2.data, 'optionalAccess', _3 => _3.errors, 'optionalAccess', _4 => _4.map, 'call', _5 => _5((err) => err.description)]) ||
        [e.message],
    });
  }
}

  // Consulta uma cobrança existente no Asaas
  async show(req, res) {
    try {
      const { id } = req.params;
      const cobranca = await _cobranca_servicejs2.default.consultarCobranca(id);

      if (!cobranca || !cobranca.id) {
        return res.status(404).json({
          errors: ['Cobrança não encontrada no Asaas'],
        });
      }

      return res.status(200).json(cobranca);
    } catch (e) {
      return res.status(400).json({
        errors:
          _optionalChain([e, 'access', _6 => _6.response, 'optionalAccess', _7 => _7.data, 'optionalAccess', _8 => _8.errors, 'optionalAccess', _9 => _9.map, 'call', _10 => _10((err) => err.description)]) ||
          [e.message],
      });
    }
  }
}

exports. default = new CobrancaControllers();