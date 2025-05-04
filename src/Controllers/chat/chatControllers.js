import { Op } from 'sequelize';
import Conversa from '../../Models/Conversa';
import Mensagem from '../../Models/Mensagem';
import Alunos from '../../Models/Alunos';
import Personal from '../../Models/Personal';

class ChatController {
  async criarConversa(req, res) {
    try {
      console.log('BODY recebido em criarConversa:', req.body);

      const {
        usuario1_id,
        tipo_usuario1,
        usuario2_id,
        tipo_usuario2,
      } = req.body;

      if (
        !usuario1_id
        || !usuario2_id
        || !tipo_usuario1
        || !tipo_usuario2
      ) {
        return res.status(400).json({
          errors: ['Todos os campos são obrigatórios.'],
        });
      }

      if (
        !['aluno', 'personal'].includes(tipo_usuario1)
        || !['aluno', 'personal'].includes(tipo_usuario2)
      ) {
        return res.status(400).json({
          errors: ['Os campos tipo_usuario devem ser "aluno" ou "personal".'],
        });
      }

      const conversa = await Conversa.create({
        usuario1_id,
        tipo_usuario1,
        usuario2_id,
        tipo_usuario2,
      });

      return res.status(201).json(conversa);
    } catch (e) {
      console.error('Erro ao criar conversa:', e);
      return res.status(400).json({
        errors: [e.message || 'Erro inesperado ao criar conversa.'],
      });
    }
  }

  async listarConversasDoUsuario(req, res) {
    try {
      const { usuarioId, tipoUsuario } = req.params;

      const conversas = await Conversa.findAll({
        where: {
          [Op.or]: [
            {
              usuario1_id: usuarioId,
              tipo_usuario1: tipoUsuario,
            },
            {
              usuario2_id: usuarioId,
              tipo_usuario2: tipoUsuario,
            },
          ],
        },
        include: [
          {
            model: Alunos,
            as: 'aluno_1',
            attributes: ['id', 'nome', 'email'],
            required: false,
          },
          {
            model: Alunos,
            as: 'aluno_2',
            attributes: ['id', 'nome', 'email'],
            required: false,
          },
          {
            model: Personal,
            as: 'personal_1',
            attributes: ['id', 'nome', 'email'],
            required: false,
          },
          {
            model: Personal,
            as: 'personal_2',
            attributes: ['id', 'nome', 'email'],
            required: false,
          },
        ],
        order: [['updated_at', 'DESC']],
      });

      return res.status(200).json(conversas);
    } catch (e) {
      return res.status(400).json({
        errors: [e.message],
      });
    }
  }

  async listarMensagens(req, res) {
    try {
      const { conversaId } = req.params;

      const mensagens = await Mensagem.findAll({
        where: { conversa_id: conversaId },
        order: [['created_at', 'ASC']],
      });

      return res.status(200).json(mensagens);
    } catch (e) {
      return res.status(400).json({
        errors: [e.message],
      });
    }
  }

  async enviarMensagem(req, res) {
    try {
      const {
        conversa_id,
        remetente_id,
        tipo_remetente,
        conteudo,
      } = req.body;

      if (
        !conversa_id
        || !remetente_id
        || !tipo_remetente
        || !conteudo
      ) {
        return res.status(400).json({
          errors: ['Todos os campos são obrigatórios para enviar a mensagem.'],
        });
      }

      const novaMensagem = await Mensagem.create({
        conversa_id,
        remetente_id,
        tipo_remetente,
        conteudo,
      });

      return res.status(201).json(novaMensagem);
    } catch (e) {
      return res.status(400).json({
        errors: [e.message],
      });
    }
  }
}

export default new ChatController();
