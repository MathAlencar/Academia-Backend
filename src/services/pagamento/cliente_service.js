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
            //   const response = await axiosInstance.get(`/customers/?cpfCnpj=${cpfCnpj}`);
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
    }
};

export default ClienteService;