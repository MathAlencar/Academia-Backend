import { Op } from 'sequelize';
import Conversa from '../../Models/Conversa';
import Mensagem from '../../Models/Mensagem';
import Alunos from '../../Models/Alunos';
import Personal from '../../Models/Personal';
import AlunoFoto from '../../Models/FotoAlunos';
import PersonalFoto from '../../Models/FotoPersonal';

class ChatController {
  async store(req, res) {
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

  async show(req, res) {
    try {
      const { usuarioId, personalId } = req.params;

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
                limit: 1,
                separate: true,
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
                limit: 1,
                separate: true,
                order: [['id', 'DESC']],
              },
            ],
          },
          {
            model: Mensagem,
            as: 'mensagens',
            attributes: ['id', 'tipo_remetente', 'conteudo', 'created_at'],
            order: [['created_at', 'DESC']],
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

  async index(req, res){
    try {
      const { usuarioId, typeUser } = req.params;
      const validate = typeUser === '1';

      const user = validate ? await Alunos.findByPk(usuarioId) : await Personal.findByPk(usuarioId);

      if (!user){
        return res.status(400).json({
          errors: ['Não existe um personal ou aluno com estes IDs'],
        });
      }

      const optionsAluno = {
        usuario1_id: usuarioId,
      };

      const optionsPersonal = {
        usuario2_id: usuarioId,
      };

      const conversas = await Conversa.findAll({
        where: validate ? optionsAluno : optionsPersonal,
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
                limit: 1, // Irá trazer somente o último registro do banco dessa tabela de acordo com a data.
                order: [['id', 'DESC']],
                separate: true, // Irá trazer somente o último registro do banco dessa tabela de acordo com a data.
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
                limit: 1,
                order: [['id', 'DESC']],
                separate: true,
              },
            ],
          },
          {
            model: Mensagem,
            as: 'mensagens',
            attributes: ['id', 'tipo_remetente', 'conteudo', 'created_at'],
            limit: 1,
            order: [['created_at', 'DESC']],
            separate: true,
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

  // Separar em duas APi's distinstas;

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
