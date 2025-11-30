"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _cliente_servicejs = require('../../services/pagamento/cliente_service.js'); var _cliente_servicejs2 = _interopRequireDefault(_cliente_servicejs);
var _Alunosjs = require('../../Models/Alunos.js'); var _Alunosjs2 = _interopRequireDefault(_Alunosjs);

class ClienteControllers {
  // Cadastra um cliente no Asaas
  async store(req, res) {
    try {
      const novoCliente = await _cliente_servicejs2.default.cadastrarCliente(req.body);

      // Encontrando o e-mail do aluno
      const aluno = await _Alunosjs2.default.findOne({
        where: {
          email: _optionalChain([novoCliente, 'optionalAccess', _ => _.email]),
        }
      })

      if(aluno) {
        await aluno.update({
          cliente_id: _optionalChain([novoCliente, 'optionalAccess', _2 => _2.id])
        })
      }

      return res.status(201).json(novoCliente);

    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _3 => _3.response, 'optionalAccess', _4 => _4.data, 'optionalAccess', _5 => _5.errors, 'optionalAccess', _6 => _6.map, 'call', _7 => _7((err) => err.description)]) || [e.message],
      });
    }
  }
}

exports. default = new ClienteControllers();
