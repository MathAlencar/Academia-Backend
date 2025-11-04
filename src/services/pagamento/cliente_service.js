import 'dotenv/config.js';
import axios from 'axios';

const ASAAS_TOKEN = process.env.ASAAS_TOKEN;
const ASAAS_API_URL = process.env.ASAAS_API_URL;

const axiosInstance = axios.create({
    baseURL: ASAAS_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_TOKEN
    }
});

const ClienteService = {
    async consultarCliente(cpfCnpj) {
        try {
            // const response = await axiosInstance.get(`/customers/?cpfCnpj=${cpfCnpj}`);
            const response = await axiosInstance.get('/customers', {
                params: { cpfCnpj }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao consultar cliente:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    async cadastrarCliente(clienteData) {
        try {
            const response = await axiosInstance.post('/customers', this.gerarClienteParaCadastro(clienteData));
            return response.data;
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    gerarClienteParaCadastro(usuario) {
        return {
            name: usuario.nome,
            cpfCnpj: usuario.cpfCnpj,
            email: usuario.email,
            mobilePhone: usuario.telefone,
        };
    },

    async atualizarClienteAsaas({ cpfCnpj, nome, telefone }) {
        try {
        if (!cpfCnpj) {
            throw new Error('CPF/CNPJ é obrigatório para atualização do cliente Asaas.');
        }

        // Busca o cliente existente no Asaas pelo CPF/CNPJ
        const buscaResponse = await axios.get(`${ASAAS_API_URL}/customers?cpfCnpj=${cpfCnpj}`, {
            headers: {
            access_token: ASAAS_TOKEN,
            },
        });

        const cliente = buscaResponse.data.data?.[0];

        if (!cliente) {
            console.warn(`Cliente Asaas com CPF/CNPJ ${cpfCnpj} não encontrado.`);
            return null;
        }

        // Monta os dados a atualizar
        const payload = {};
        if (nome && nome !== cliente.name) payload.name = nome;
        if (telefone && telefone !== cliente.mobilePhone) payload.mobilePhone = telefone;

        if (Object.keys(payload).length === 0) {
            console.log('Nenhuma alteração detectada para atualização no Asaas.');
            return cliente;
        }

        // Envia atualização para o Asaas
        const updateResponse = await axios.post(
            `${ASAAS_API_URL}/customers/${cliente.id}`,
            payload,
            {
            headers: {
                access_token: ASAAS_TOKEN,
            },
            }
        );

        console.log(`Cliente ${cliente.id} atualizado com sucesso no Asaas.`);
        return updateResponse.data;

        } catch (err) {
        console.error('Erro ao atualizar cliente no Asaas:', err.response?.data || err.message);
        throw new Error('Falha ao atualizar cliente no Asaas.');
        }
  }
};

export default ClienteService;