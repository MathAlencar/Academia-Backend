"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }require('dotenv/config.js');  
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);  
var _Subcontajs = require('../../Models/Subconta.js'); var _Subcontajs2 = _interopRequireDefault(_Subcontajs);
var _Personaljs = require('../../Models/Personal.js'); var _Personaljs2 = _interopRequireDefault(_Personaljs);  
var _Enderecosjs = require('../../Models/Enderecos.js'); var _Enderecosjs2 = _interopRequireDefault(_Enderecosjs); 
  
const ASAAS_TOKEN = process.env.ASAAS_TOKEN;  
const ASAAS_API_URL = process.env.ASAAS_API_URL;  

// Dados que o personal precisa informar ao clicar em "Ativar recebimentos"  
// (não existem na tabela Personal hoje).  
function validarDadosObrigatorios(dados) {  
  const faltando = [];  
  if (!dados.cpfCnpj) faltando.push('cpfCnpj');  
  if (!dados.dataNascimento) faltando.push('dataNascimento');  
  if (!dados.telefone) faltando.push('telefone');  
  if (!dados.rendaMensal) faltando.push('rendaMensal');  
  
  if (faltando.length) {  
    throw new Error(`Campos obrigatórios ausentes: ${faltando.join(', ')}.`);  
  }  
}  
  
async function carregarDadosPersonal(personalId) {  
  const personal = await _Personaljs2.default.findByPk(personalId);  
  if (!personal) {  
    throw new Error('Personal não encontrado.');  
  }  
  
  const endereco = await _Enderecosjs2.default.findOne({ where: { personal_id: personalId } });  
  if (!endereco) {  
    throw new Error('Personal não possui endereço cadastrado. Conclua o cadastro antes de ativar recebimentos.');  
  }  
  
  return { personal, endereco };  
}  
  
function montarPayloadAsaas({ personal, endereco, dados }) {  
  return {  
    name: personal.nome,  
    email: personal.email,  
    cpfCnpj: _optionalChain([dados, 'access', _ => _.cpfCnpj, 'optionalAccess', _2 => _2.replace, 'call', _3 => _3(/\D/g, '')]),  
    birthDate: dados.dataNascimento,  
    phone: _optionalChain([dados, 'access', _4 => _4.telefone, 'optionalAccess', _5 => _5.replace, 'call', _6 => _6(/\D/g, '')]),  
    address: endereco.rua,  
    addressNumber: String(endereco.numero),  
    complement: endereco.complemento || undefined,  
    province: endereco.bairro,  
    postalCode: _optionalChain([endereco, 'access', _7 => _7.cep, 'optionalAccess', _8 => _8.replace, 'call', _9 => _9(/\D/g, '')]),  
    incomeValue: dados.rendaMensal,  
    companyType: dados.companyType || 'MEI',  
  };  
}

const SubcontaService = {  

  async consultarMinhaSubconta(personalId) {
    try {
      if (!personalId) {
        throw new Error('Personal não autenticado.');
      }

      return await _Subcontajs2.default.findOne({
        where: { personal_id: personalId },
        attributes: [
          'id',
          'personal_id',
          'asaas_account_id',
          'wallet_id',
          'onboarding_url',
          'company_type',
          'status_cadastro',
          'status_aprovacao',
          'status_recebimento',
          'created_at',
          'updated_at',
        ],
      });
    } catch (error) {
      console.error('Erro ao consultar subconta:', error.message);
      throw new Error(error.message || 'Falha ao consultar subconta.');
    }
  },
  
  async criarSubconta(personalId, dados) {   
    let subconta = null;  
  
    try {
            if (!personalId) {  
        throw new Error('Personal não autenticado.');  
      }  
  
      validarDadosObrigatorios(dados);  
  
      const { personal, endereco } = await carregarDadosPersonal(personalId);

      const existente = await _Subcontajs2.default.findOne({
        where: { personal_id: personalId },
      });

      if (existente && existente.status_cadastro === 'CONCLUIDO') {
        throw new Error('Esse personal já possui uma subconta cadastrada.');  
      }  
  
      if (existente) {  
        subconta = existente;  
        await subconta.update({  
          status_cadastro: 'PENDENTE',  
          company_type: dados.companyType || 'MEI',  
        });
      } else {  
        subconta = await _Subcontajs2.default.create({  
          personal_id: personalId,  
          company_type: dados.companyType || 'MEI',  
          status_cadastro: 'PENDENTE',  
          status_aprovacao: 'PENDENTE',  
          status_recebimento: 'PENDENTE',  
        });  
      }  
  
      const response = await _axios2.default.post(  
        `${ASAAS_API_URL}/accounts`,  
        montarPayloadAsaas({ personal, endereco, dados }),
        {  
          headers: {  
            'Content-Type': 'application/json',  
            access_token: ASAAS_TOKEN,  
          },  
        }  
      );  
      
      console.log('Resposta Asaas /accounts:', JSON.stringify(response.data, null, 2));
      const { id, walletId, apiKey, onboardingUrl } = response.data;  
  
      await subconta.update({  
        asaas_account_id: id,  
        wallet_id: walletId,  
        api_key_encrypted: apiKey,  
        onboarding_url: onboardingUrl || null,  
        status_cadastro: 'CONCLUIDO',  
      });  
  
      return subconta;  
    } catch (error) {  
      console.error('Erro ao criar subconta:', _optionalChain([error, 'access', _10 => _10.response, 'optionalAccess', _11 => _11.data]) || error.message);  
  
      if (subconta) {  
        await subconta.update({ status_cadastro: 'ERRO' });  
      }  
  
      throw new Error(error.message || 'Falha ao criar subconta no Asaas.');  
    }  
  },  
  
  async atualizarSubconta(personalId, dados) {  
    try { 
      if (!personalId) {  
        throw new Error('Personal não autenticado.');  
      }

      const subconta = await _Subcontajs2.default.findOne({ where: { personal_id: personalId } });  
  
      if (!subconta) {  
        throw new Error('Subconta não encontrada para o personal informado.');  
      }  
  
      if (!subconta.asaas_account_id) {  
        throw new Error('Subconta não possui conta vinculada ao Asaas.');  
      }  
      
      const { personal, endereco } = await carregarDadosPersonal(personalId);

      await _axios2.default.put(  
        `${ASAAS_API_URL}/accounts/${subconta.asaas_account_id}`,  
        montarPayloadAsaas({ personal, endereco, dados }),
        {  
          headers: {  
            'Content-Type': 'application/json',  
            access_token: ASAAS_TOKEN,  
          },  
        }  
      );  
      
      if (dados.companyType) {  
        await subconta.update({ company_type: dados.companyType });  
      } 

      return subconta;  
    } catch (error) {  
      console.error('Erro ao atualizar subconta:', _optionalChain([error, 'access', _12 => _12.response, 'optionalAccess', _13 => _13.data]) || error.message);  
      throw new Error(error.message || 'Falha ao atualizar subconta no Asaas.');  
    }  
  },  
};  
  
exports. default = SubcontaService;
