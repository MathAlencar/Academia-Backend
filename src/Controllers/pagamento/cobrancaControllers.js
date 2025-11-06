import CobrancaService from '../../services/pagamento/cobranca_service.js';
import Subconta from '../../Models/Subconta.js';
import Aluno from '../../Models/Alunos.js';
import Plano from '../../Models/PlanosPersonal.js';

class CobrancaControllers {

  // Cria uma cobrança no Asaas
async store(req, res) {
  try {
    const { alunoId, planoId, dadosCartao } = req.body;
    let { forma } = req.body;

    // Normaliza a forma de pagamento (case-insensitive)
    forma = typeof forma === 'string' ? forma.toUpperCase() : null;

    if (!forma) {
      return res.status(400).json({
        errors: ['Forma de pagamento não informada.'],
      });
    }

    // Buscar aluno
    const aluno = await Aluno.findByPk(alunoId);
    if (!aluno) {
      return res.status(404).json({
        errors: ['Aluno não encontrado.'],
      });
    }

    if (!aluno.cliente_id) {
      return res.status(400).json({
        errors: ['Aluno não possui cliente_id configurado no Asaas.'],
      });
    }

    // Buscar plano
    const plano = await Plano.findByPk(planoId);
    if (!plano) {
      return res.status(404).json({
        errors: ['Plano não encontrado.'],
      });
    }

    // Buscar subconta do personal
    const subconta = await Subconta.findOne({
      where: { personal_id: plano.personal_id },
    });

    if (!subconta) {
      return res.status(404).json({
        errors: ['Subconta do personal não encontrada.'],
      });
    }

    if (!subconta.carteira_id) {
      return res.status(400).json({
        errors: ['Personal não possui carteira_id configurado.'],
      });
    }

    // Montar split automático
    const splitConfig = [
      {
        walletId: subconta.carteira_id,
        percentualValue: 95.0,
      },
    ];

    // Criar cobrança no Asaas
    const cobranca = await CobrancaService.criarCobranca(
      aluno,
      forma,
      plano.valor,
      splitConfig,
      dadosCartao
    );

    return res.status(201).json(cobranca);
  } catch (e) {
    console.error('Erro ao criar cobrança:', e);

    return res.status(400).json({
      errors:
        e.response?.data?.errors?.map((err) => err.description) ||
        [e.message],
    });
  }
}

  // Consulta uma cobrança existente no Asaas
  async show(req, res) {
    try {
      const { id } = req.params;
      const cobranca = await CobrancaService.consultarCobranca(id);

      if (!cobranca || !cobranca.id) {
        return res.status(404).json({
          errors: ['Cobrança não encontrada no Asaas'],
        });
      }

      return res.status(200).json(cobranca);
    } catch (e) {
      return res.status(400).json({
        errors:
          e.response?.data?.errors?.map((err) => err.description) ||
          [e.message],
      });
    }
  }
}

export default new CobrancaControllers();