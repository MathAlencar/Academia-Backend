import 'dotenv/config.js';
import axios from 'axios';
import Subconta from '../../Models/Subconta.js';
import Personal from '../../Models/Personal.js';

const ASAAS_TOKEN = process.env.ASAAS_TOKEN;
const ASAAS_API_URL = process.env.ASAAS_API_URL;

axios.create({
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
      novaSubconta = await Subconta.create({
        personal_id: dados.personalId,
        cpf_cnpj: dados.cpfCnpj?.replace(/\D/g, '') || null,
        data_nascimento: dados.dataNascimento || null,
        renda_mensal: dados.rendaMensal || null,
        endereco: dados.endereco || null,
        numero_endereco: dados.numeroEndereco || null,
        bairro: dados.bairro || null,
        cep: dados.cep || null,
        telefone: dados.telefone?.replace(/\D/g, '') || null,
        status: 'PENDENTE'
      });

      // Cria a subconta no Asaas
      const response = await axios.post(
        `${process.env.ASAAS_API_URL}/accounts`,
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
      console.error('Erro ao criar subconta:', error.response?.data || error.message);

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
      const subconta = await Subconta.findOne({ where: { personal_id: personalId } });

      if (!subconta) {
        throw new Error('Subconta não encontrada para o personal informado.');
      }

      // Atualiza os campos locais
      await subconta.update({
        data_nascimento: dados.dataNascimento ?? subconta.data_nascimento,
        renda_mensal: dados.rendaMensal ?? subconta.renda_mensal,
        endereco: dados.endereco ?? subconta.endereco,
        numero_endereco: dados.numeroEndereco ?? subconta.numero_endereco,
        bairro: dados.bairro ?? subconta.bairro,
        cep: dados.cep ?? subconta.cep,
        telefone: dados.telefone?.replace(/\D/g, '') ?? subconta.telefone
      });

      // Atualiza também no Asaas
      await this.atualizarSubcontaNoAsaas(subconta);

      return subconta;
    } catch (error) {
      console.error('Erro ao atualizar subconta:', error.response?.data || error.message);
      throw new Error('Falha ao atualizar subconta.');
    }
  },

  async atualizarSubcontaNoAsaas(subconta) {
    try {
      if (!subconta.conta_id) {
        throw new Error('Subconta não possui conta_id vinculado ao Asaas.');
      }

      await axios.put(
        `${process.env.ASAAS_API_URL}/accounts/${subconta.conta_id}`,
        {
          name: subconta.nome,
          email: subconta.email,
          cpfCnpj: subconta.cpf_cnpj?.replace(/\D/g, ''),
          birthDate: subconta.data_nascimento,
          phone: subconta.telefone?.replace(/\D/g, ''),
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
      console.error('Erro ao atualizar subconta no Asaas:', error.response?.data || error.message);
      throw new Error('Falha ao atualizar subconta no Asaas.');
    }
  }
};

export default SubcontaService;
