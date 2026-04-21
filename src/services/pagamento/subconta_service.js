import 'dotenv/config.js';  
import axios from 'axios';  
import Subconta from '../../Models/Subconta.js';  
  
const ASAAS_TOKEN = process.env.ASAAS_TOKEN;  
const ASAAS_API_URL = process.env.ASAAS_API_URL;  
  
const SubcontaService = {  
  
  async criarSubconta(dados) {  
    let subconta = null;  
  
    try {  
      const existente = await Subconta.findOne({  
        where: { personal_id: dados.personalId },  
      });  
  
      if (existente && existente.status_cadastro === 'CONCLUIDO') {  
        throw new Error('Esse personal já possui uma subconta cadastrada.');  
      }  
  
      if (existente) {  
        subconta = existente;  
        await subconta.update({ status_cadastro: 'PENDENTE' });  
      } else {  
        subconta = await Subconta.create({  
          personal_id: dados.personalId,  
          status_cadastro: 'PENDENTE',  
          status_aprovacao: 'PENDENTE',  
          status_recebimento: 'PENDENTE',  
        });  
      }  
  
      const response = await axios.post(  
        `${ASAAS_API_URL}/accounts`,  
        {  
          name: dados.nome,  
          email: dados.email,  
          cpfCnpj: dados.cpfCnpj?.replace(/\D/g, ''),  
          birthDate: dados.dataNascimento,  
          phone: dados.telefone?.replace(/\D/g, ''),  
          address: dados.endereco,  
          addressNumber: dados.numeroEndereco,  
          province: dados.bairro,  
          postalCode: dados.cep,  
          incomeValue: dados.rendaMensal,  
        },  
        {  
          headers: {  
            'Content-Type': 'application/json',  
            access_token: ASAAS_TOKEN,  
          },  
        }  
      );  
  
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
      const subconta = await Subconta.findOne({ where: { personal_id: personalId } });  
  
      if (!subconta) {  
        throw new Error('Subconta não encontrada para o personal informado.');  
      }  
  
      if (!subconta.asaas_account_id) {  
        throw new Error('Subconta não possui conta vinculada ao Asaas.');  
      }  
  
      await axios.put(  
        `${ASAAS_API_URL}/accounts/${subconta.asaas_account_id}`,  
        {  
          name: dados.nome,  
          email: dados.email,  
          cpfCnpj: dados.cpfCnpj?.replace(/\D/g, ''),  
          birthDate: dados.dataNascimento,  
          phone: dados.telefone?.replace(/\D/g, ''),  
          address: dados.endereco,  
          addressNumber: dados.numeroEndereco,  
          province: dados.bairro,  
          postalCode: dados.cep,  
          incomeValue: dados.rendaMensal,  
        },  
        {  
          headers: {  
            'Content-Type': 'application/json',  
            access_token: ASAAS_TOKEN,  
          },  
        }  
      );  
  
      return subconta;  
    } catch (error) {  
      console.error('Erro ao atualizar subconta:', error.response?.data || error.message);  
      throw new Error(error.message || 'Falha ao atualizar subconta no Asaas.');  
    }  
  },  
};  
  
export default SubcontaService;