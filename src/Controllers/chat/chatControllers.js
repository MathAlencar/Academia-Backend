import { Op } from 'sequelize';
import Conversa from '../../Models/Conversa';
import Mensagem from '../../Models/Mensagem';
import Alunos from '../../Models/Alunos';
import Personal from '../../Models/Personal';
import AlunoFoto from '../../Models/FotoAlunos';
import PersonalFoto from '../../Models/FotoPersonal';

class ChatController {
  async criarConversa(req, res) {
    try {
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

      const verificandoChatExist = await Conversa.findOne({
        where: {
          usuario1_id,
          usuario2_id,
        },
      });

      if (verificandoChatExist) {
        return res.status(401).json({
          errors: ['Já existe uma conversa iniciada entre este aluno e o Personal'],
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
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async listarConversasDoUsuario(req, res) {
    try {
      const { usuarioId, personalId } = req.params;

      console.log(personalId, usuarioId);

      const findAluno = await Alunos.findByPk(usuarioId);
      const findPersonal = await Personal.findByPk(personalId);

      if (!findAluno || !findPersonal){
        return res.status(400).json({
          errors: ['Não existe um personal ou aluno com estes IDs '],
        });
      }

      const conversas = await Conversa.findAll({
        where: {
          usuario1_id: usuarioId,
          usuario2_id: personalId,
        },
        include: [
          {
            model: Alunos,
            as: 'aluno_1',
            attributes: ['id', 'nome', 'email'],
            required: false,
            include: [
              {
                model: AlunoFoto,
                attributes: ['url', 'filename'],
                order: [['id', 'DESC']],
              },
            ],
          },
          {
            model: Personal,
            as: 'personal_1',
            attributes: ['id', 'nome', 'email'],
            required: false,
            include: [
              {
                model: PersonalFoto,
                attributes: ['url', 'filename'],
                order: [['id', 'DESC']],
              },
            ],
          },
        ],
        order: [['updated_at', 'DESC']],
      });

      return res.status(200).json(conversas);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
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
        errors: e.errors?.map((err) => err.message) || [e.message],
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
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }
}

export default new ChatController();
