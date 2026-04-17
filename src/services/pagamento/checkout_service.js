import 'dotenv/config.js';  
import axios from 'axios';  
  
const ASAAS_TOKEN = process.env.ASAAS_TOKEN;  
const ASAAS_API_URL = process.env.ASAAS_API_URL;  
const ASAAS_PRAZO_PAGTO_DIAS = Number(process.env.ASAAS_PRAZO_PAGTO_DIAS) || 15;  
  
const axiosInstance = axios.create({  
  baseURL: ASAAS_API_URL,  
  headers: {  
    'Content-Type': 'application/json',  
    access_token: ASAAS_TOKEN,  
  },  
});  
  
/**  
 * Cria um Payment Link (checkout) no Asaas sem customer e sem customerData.  
 *  
 * @param {string} nome - Nome/descrição do plano ou serviço  
 * @param {number} valor - Valor da cobrança  
 * @param {string|null} carteiraIdPersonal - walletId da subconta do personal (para split)  
 * @param {number} percentualPersonal - Percentual do split para o personal (ex: 95)  
 * @returns {Promise<object>} Dados retornados pelo Asaas (id, url, etc.)  
 */  
async function criarCheckout(nome, valor, carteiraIdPersonal = null, percentualPersonal = 90) {  
  try {  
    const body = {  
      name: nome,  
      billingType: 'UNDEFINED',   // aluno escolhe a forma de pagamento no checkout  
      chargeType: 'DETACHED',     // cobrança avulsa (usar 'RECURRENT' para assinatura)  
      value: valor,  
      dueDateLimitDays: ASAAS_PRAZO_PAGTO_DIAS,  
      subscriptionCycle: null,  
      maxInstallmentCount: 1,     // sem parcelamento (ajustar conforme regra de negócio)  
      notificationEnabled: true,  // Asaas envia e-mail/SMS ao pagador  
      // SEM customer  
      // SEM customerData  
    };  
  
    // Adiciona split se o personal tiver subconta com carteira configurada  
    if (carteiraIdPersonal) {  
      body.split = [  
        {  
          walletId: carteiraIdPersonal,  
          percentualValue: percentualPersonal,  
        },  
      ];  
    }  
  
    const response = await axiosInstance.post('/paymentLinks', body);  
    return response.data;  
  } catch (error) {  
    console.error(  
      'Erro ao criar checkout:',  
      error.response ? error.response.data : error.message,  
    );  
    throw error;  
  }  
}  
  
/**  
 * Consulta um Payment Link existente pelo ID.  
 */  
async function consultarCheckout(paymentLinkId) {  
  try {  
    const response = await axiosInstance.get(`/paymentLinks/${paymentLinkId}`);  
    return response.data;  
  } catch (error) {  
    console.error(  
      'Erro ao consultar checkout:',  
      error.response ? error.response.data : error.message,  
    );  
    throw error;  
  }  
}  
  
export default {  
  criarCheckout,  
  consultarCheckout,  
};