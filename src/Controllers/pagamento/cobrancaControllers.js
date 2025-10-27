import CobrancaService from '../../services/pagamento/cobranca_service.js';
import Personal from '../../Models/Personal.js';
import Aluno from '../../Models/Alunos.js';
import Plano from '../../Models/PlanosPersonal.js';
import { TiposPlano } from '../../enums/tipos_plano.js';

class CobrancaControllers {
  // Cria uma cobrança no Asaas
  async store(req, res) {
    try {
      const { alunoId, personalId, forma, tipoPlano, dadosCartao } = req.body;

      // Validação do tipoPlano com base no enum
      const tiposValidos = Object.values(TiposPlano);
      if (!tiposValidos.includes(tipoPlano)) {
        return res.status(400).json({
          errors: [
            `Tipo de plano inválido. Tipos permitidos: ${tiposValidos.join(', ')}`,
          ],
        });
      }

      // Buscar o aluno
      const aluno = await Aluno.findByPk(alunoId);
      if (!aluno) {
        return res.status(404).json({
          errors: ['Aluno não encontrado'],
        });
      }

      if (!aluno.cliente_id) {
        return res.status(400).json({
          errors: ['Aluno não possui cliente_id configurado no Asaas'],
        });
      }

      // Buscar o personal
      const personal = await Personal.findByPk(personalId);
      if (!personal) {
        return res.status(404).json({
          errors: ['Personal não encontrado'],
        });
      }

      if (!personal.carteira_id) {
        return res.status(400).json({
          errors: ['Personal não possui carteira_id configurado'],
        });
      }

      console.log('🎯 Buscando plano...', { personalId, tipoPlano });
      // Buscar o plano
      const plano = await Plano.findOne({
        where: {
          personal_id: personalId,
          tipo_plano: tipoPlano,
        },
      });

      if (!plano) {
        return res.status(404).json({
          errors: [
            `Plano do tipo "${tipoPlano}" não encontrado para este personal`,
          ],
        });
      }

      // Montar split automaticamente
      const splitConfig = [
        {
          walletId: personal.carteira_id,
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