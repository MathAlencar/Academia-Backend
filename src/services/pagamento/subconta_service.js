import 'dotenv/config.js';  
import axios from 'axios';  
import Subconta from '../../Models/Subconta.js';
import Personal from '../../Models/Personal.js';  
import Enderecos from '../../Models/Enderecos.js'; 
  
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
  const personal = await Personal.findByPk(personalId);  
  if (!personal) {  
    throw new Error('Personal não encontrado.');  
  }  
  
  const endereco = await Enderecos.findOne({ where: { personal_id: personalId } });  
  if (!endereco) {  
    throw new Error('Personal não possui endereço cadastrado. Conclua o cadastro antes de ativar recebimentos.');  
  }  
  
  return { personal, endereco };  
}  
  
function montarPayloadAsaas({ personal, endereco, dados }) {  
  return {  
    name: personal.nome,  
    email: personal.email,  
    cpfCnpj: dados.cpfCnpj?.replace(/\D/g, ''),  
    birthDate: dados.dataNascimento,  
    phone: dados.telefone?.replace(/\D/g, ''),  
    address: endereco.rua,  
    addressNumber: String(endereco.numero),  
    complement: endereco.complemento || undefined,  
    province: endereco.bairro,  
    postalCode: endereco.cep?.replace(/\D/g, ''),  
    incomeValue: dados.rendaMensal,  
    companyType: dados.companyType || 'MEI',  
  };  
}

const SubcontaService = {  
  
  async criarSubconta(personalId, dados) {   
    let subconta = null;  
  
    try {
            if (!personalId) {  
        throw new Error('Personal não autenticado.');  
      }  
  
      validarDadosObrigatorios(dados);  
  
      const { personal, endereco } = await carregarDadosPersonal(personalId);

      const existente = await Subconta.findOne({
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
        subconta = await Subconta.create({  
          personal_id: personalId,  
          company_type: dados.companyType || 'MEI',  
          status_cadastro: 'PENDENTE',  
          status_aprovacao: 'PENDENTE',  
          status_recebimento: 'PENDENTE',  
        });  
      }  
  
      const response = await axios.post(  
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
      console.error('Erro ao criar subconta:', error.response?.data || error.message);  
  
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

      const subconta = await Subconta.findOne({ where: { personal_id: personalId } });  
  
      if (!subconta) {  
        throw new Error('Subconta não encontrada para o personal informado.');  
      }  
  
      if (!subconta.asaas_account_id) {  
        throw new Error('Subconta não possui conta vinculada ao Asaas.');  
      }  
      
      const { personal, endereco } = await carregarDadosPersonal(personalId);

      await axios.put(  
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
      console.error('Erro ao atualizar subconta:', error.response?.data || error.message);  
      throw new Error(error.message || 'Falha ao atualizar subconta no Asaas.');  
    }  
  },  
};  
  
export default SubcontaService;