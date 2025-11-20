"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }require('dotenv/config.js');
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);
var _Subcontajs = require('../../Models/Subconta.js'); var _Subcontajs2 = _interopRequireDefault(_Subcontajs);
var _Personaljs = require('../../Models/Personal.js'); var _Personaljs2 = _interopRequireDefault(_Personaljs);

const ASAAS_TOKEN = process.env.ASAAS_TOKEN;
const ASAAS_API_URL = process.env.ASAAS_API_URL;

_axios2.default.create({
  baseURL: ASAAS_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'access_token': ASAAS_TOKEN,
  },
});

const SubcontaService = {
    // Cria uma subconta no banco e no Asaas

  async criarSubconta(dados) {
    let novaSubconta = null;

    try {
      // Cria o registro inicial da subconta no banco
      novaSubconta = await _Subcontajs2.default.create({
        personal_id: dados.personalId,
        cpf_cnpj: _optionalChain([dados, 'access', _ => _.cpfCnpj, 'optionalAccess', _2 => _2.replace, 'call', _3 => _3(/\D/g, '')]) || null,
        data_nascimento: dados.dataNascimento || null,
        renda_mensal: dados.rendaMensal || null,
        endereco: dados.endereco || null,
        numero_endereco: dados.numeroEndereco || null,
        bairro: dados.bairro || null,
        cep: dados.cep || null,
        telefone: _optionalChain([dados, 'access', _4 => _4.telefone, 'optionalAccess', _5 => _5.replace, 'call', _6 => _6(/\D/g, '')]) || null,
        status: 'PENDENTE'
      });

      // Cria a subconta no Asaas
      const response = await _axios2.default.post(
        `${process.env.ASAAS_API_URL}/accounts`,
        {
          name: dados.nome,
          email: dados.email,
          cpfCnpj: _optionalChain([dados, 'access', _7 => _7.cpfCnpj, 'optionalAccess', _8 => _8.replace, 'call', _9 => _9(/\D/g, '')]),
          birthDate: dados.dataNascimento,
          phone: _optionalChain([dados, 'access', _10 => _10.telefone, 'optionalAccess', _11 => _11.replace, 'call', _12 => _12(/\D/g, '')]),
          address: dados.endereco,
          addressNumber: dados.numeroEndereco,
          province: dados.bairro,
          postalCode: dados.cep,
          incomeValue: dados.rendaMensal
        },
        {
          headers: {
            'Content-Type': 'application/json',
            access_token: ASAAS_TOKEN
          }
        }
      );

      // Atualiza a subconta com os dados retornados pelo Asaas
      const { id: conta_id, walletId: carteira_id, apiKey } = response.data;

      await novaSubconta.update({
        conta_id,
        carteira_id,
        api_key: apiKey,
        status: 'ATIVA'
      });

      return novaSubconta;
    } catch (error) {
      console.error('Erro ao criar subconta:', _optionalChain([error, 'access', _13 => _13.response, 'optionalAccess', _14 => _14.data]) || error.message);

      // Caso o erro ocorra após a criação no banco, mantém registro, mas marca como erro
      if (novaSubconta) {
        await novaSubconta.update({ status: 'ERRO' });
      }

      throw new Error('Falha ao criar subconta no Asaas.');
    }
  },

  async atualizarSubconta(personalId, dados) {
    try {
      // Busca subconta pelo personal_id
      const subconta = await _Subcontajs2.default.findOne({ where: { personal_id: personalId } });

      if (!subconta) {
        throw new Error('Subconta não encontrada para o personal informado.');
      }

      // Atualiza os campos locais
      await subconta.update({
        data_nascimento: _nullishCoalesce(dados.dataNascimento, () => ( subconta.data_nascimento)),
        renda_mensal: _nullishCoalesce(dados.rendaMensal, () => ( subconta.renda_mensal)),
        endereco: _nullishCoalesce(dados.endereco, () => ( subconta.endereco)),
        numero_endereco: _nullishCoalesce(dados.numeroEndereco, () => ( subconta.numero_endereco)),
        bairro: _nullishCoalesce(dados.bairro, () => ( subconta.bairro)),
        cep: _nullishCoalesce(dados.cep, () => ( subconta.cep)),
        telefone: _nullishCoalesce(_optionalChain([dados, 'access', _15 => _15.telefone, 'optionalAccess', _16 => _16.replace, 'call', _17 => _17(/\D/g, '')]), () => ( subconta.telefone))
      });

      // Atualiza também no Asaas
      await this.atualizarSubcontaNoAsaas(subconta);

      return subconta;
    } catch (error) {
      console.error('Erro ao atualizar subconta:', _optionalChain([error, 'access', _18 => _18.response, 'optionalAccess', _19 => _19.data]) || error.message);
      throw new Error('Falha ao atualizar subconta.');
    }
  },

  async atualizarSubcontaNoAsaas(subconta) {
    try {
      if (!subconta.conta_id) {
        throw new Error('Subconta não possui conta_id vinculado ao Asaas.');
      }

      await _axios2.default.put(
        `${process.env.ASAAS_API_URL}/accounts/${subconta.conta_id}`,
        {
          name: subconta.nome,
          email: subconta.email,
          cpfCnpj: _optionalChain([subconta, 'access', _20 => _20.cpf_cnpj, 'optionalAccess', _21 => _21.replace, 'call', _22 => _22(/\D/g, '')]),
          birthDate: subconta.data_nascimento,
          phone: _optionalChain([subconta, 'access', _23 => _23.telefone, 'optionalAccess', _24 => _24.replace, 'call', _25 => _25(/\D/g, '')]),
          address: subconta.endereco,
          addressNumber: subconta.numero_endereco,
          province: subconta.bairro,
          postalCode: subconta.cep,
          monthlyRevenue: Number(subconta.renda_mensal)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            access_token: ASAAS_TOKEN
          }
        }
      );

      return { message: 'Subconta atualizada no Asaas com sucesso.' };
    } catch (error) {
      console.error('Erro ao atualizar subconta no Asaas:', _optionalChain([error, 'access', _26 => _26.response, 'optionalAccess', _27 => _27.data]) || error.message);
      throw new Error('Falha ao atualizar subconta no Asaas.');
    }
  }
};

exports. default = SubcontaService;
