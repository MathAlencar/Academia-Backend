"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }require('dotenv/config.js');
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);

const ASAAS_TOKEN = process.env.ASAAS_TOKEN;
const ASAAS_API_URL = process.env.ASAAS_API_URL;

const axiosInstance = _axios2.default.create({
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
        const buscaResponse = await _axios2.default.get(`${ASAAS_API_URL}/customers?cpfCnpj=${cpfCnpj}`, {
            headers: {
            access_token: ASAAS_TOKEN,
            },
        });

        const cliente = _optionalChain([buscaResponse, 'access', _ => _.data, 'access', _2 => _2.data, 'optionalAccess', _3 => _3[0]]);

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
        const updateResponse = await _axios2.default.post(
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
        console.error('Erro ao atualizar cliente no Asaas:', _optionalChain([err, 'access', _4 => _4.response, 'optionalAccess', _5 => _5.data]) || err.message);
        throw new Error('Falha ao atualizar cliente no Asaas.');
        }
  }
};

exports. default = ClienteService;
