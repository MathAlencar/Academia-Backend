import PlanosPersonal from '../../Models/PlanosPersonal.js';
import { TiposPlano } from '../../enums/tipos_plano.js';


class PlanosPersonalController {
  // Cria um novo plano para um personal
  async store(req, res) {
    try {
      const { personal_id, tipo_plano, valor } = req.body;

      if (!personal_id || !tipo_plano || !valor) {
        return res.status(400).json({
          errors: ['Campos obrigatórios: personal_id, tipo_plano e valor.'],
        });
      }

      // Verifica se já existe plano do mesmo tipo para este personal
      const planoExistente = await PlanosPersonal.findOne({
        where: { personal_id, tipo_plano },
      });

      if (planoExistente) {
        return res.status(400).json({
          errors: [`Este personal já possui um plano do tipo ${tipo_plano}.`],
        });
      }

      const novoPlano = await PlanosPersonal.create({
        personal_id,
        tipo_plano,
        valor,
      });

      return res.status(201).json({
        message: 'Plano criado com sucesso.',
        data: novoPlano,
      });
    } catch (error) {
      console.error('Erro ao criar plano:', error);

      // Trata erro de violação de unique index do banco
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          errors: ['Este personal já possui um plano deste tipo.'],
        });
      }

      // Trata erro de chave estrangeira (personal inexistente)
      if (error.parent?.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
          errors: ['O personal informado não existe.'],
        });
      }

      return res.status(400).json({
        errors: [error.message || 'Erro ao criar plano.'],
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { personal_id, tipo_plano, valor } = req.body;

      // Garante que personal_id não possa ser alterado
      if (personal_id) {
        return res.status(400).json({
          errors: ['O campo personal_id não pode ser alterado.'],
        });
      }

      const plano = await PlanosPersonal.findByPk(id);

      if (!plano) {
        return res.status(404).json({
          errors: ['Plano não encontrado.'],
        });
      }

      // Validação do tipo_plano
      if (tipo_plano && !Object.values(TiposPlano).includes(tipo_plano)) {
        return res.status(400).json({
          errors: [
            `Tipo de plano inválido. Os valores permitidos são: ${Object.values(TiposPlano).join(', ')}.`,
          ],
        });
      }

      // Verifica se já existe outro plano do mesmo tipo para o mesmo personal
      if (tipo_plano) {
        const existeMesmoTipo = await PlanosPersonal.findOne({
          where: {
            personal_id: plano.personal_id,
            tipo_plano,
          },
        });

        if (existeMesmoTipo && existeMesmoTipo.id !== plano.id) {
          return res.status(400).json({
            errors: [`Este personal já possui um plano do tipo ${tipo_plano}.`],
          });
        }
      }

      // Atualiza apenas os campos permitidos
      await plano.update({
        tipo_plano: tipo_plano ?? plano.tipo_plano,
        valor: valor ?? plano.valor,
      });

      return res.status(200).json({
        message: 'Plano atualizado com sucesso.',
        data: plano,
      });
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);

      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          errors: ['Este personal já possui um plano deste tipo.'],
        });
      }

      return res.status(400).json({
        errors: [error.message || 'Erro ao atualizar plano.'],
      });
    }
  }

  // Lista todos os planos de um personal
  async index(req, res) {
    try {
      const { personal_id } = req.params;

      if (!personal_id) {
        return res.status(400).json({
          errors: ['O campo personal_id é obrigatório.'],
        });
      }

      const planos = await PlanosPersonal.findAll({
        where: { personal_id },
        order: [['id', 'ASC']],
      });

      if (!planos || planos.length === 0) {
        return res.status(404).json({
          errors: ['Nenhum plano encontrado para este personal.'],
        });
      }

      return res.status(200).json(planos);
    } catch (error) {
      console.error('Erro ao listar planos:', error);
      return res.status(400).json({
        errors: [error.message || 'Erro ao listar planos.'],
      });
    }
  }

  // Exclui um plano específico (por ID)
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Valida parâmetro
      if (!id) {
        return res.status(400).json({
          errors: ['O campo id é obrigatório.'],
        });
      }

      // Busca o plano
      const plano = await PlanosPersonal.findByPk(id);

      if (!plano) {
        return res.status(404).json({
          errors: ['Plano não encontrado.'],
        });
      }

      // Remove do banco
      await plano.destroy();

      return res.status(200).json({
        message: 'Plano removido com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao remover plano:', error);

      // Tratamento de erro de integridade referencial
      if (error.parent?.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({
          errors: ['Este plano não pode ser removido porque está vinculado a outros registros.'],
        });
      }

      return res.status(400).json({
        errors: [error.message || 'Erro ao remover plano.'],
      });
    }
  }
}

export default new PlanosPersonalController();
