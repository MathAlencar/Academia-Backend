import Enderecos from '../../Models/Enderecos';
import Alunos from '../../Models/Alunos';
import Personal from '../../Models/Personal';

class EnderecosControllers {
  async store(req, res) {
    try {
      const { aluno_id, personal_id } = req.body;
      let endereco = '';

      if (aluno_id) {
        const id = aluno_id;
        const aluno = await Alunos.findByPk(id, {
          include: {
            model: Enderecos,
            attributes: ['id', 'aluno_id'],
            order: [['id', 'DESC']],
          },
        });

        if (!aluno) {
          return res.status(404).json({
            errors: ['Nenhum aluno foi encontrado'],
          });
        }

        if (aluno.dataValues.Endereco) {
          return res.status(401).json({
            errors: ['Já há um endereço vinculado a este perfil'],
          });
        }

        endereco = await Enderecos.create(req.body);
      }

      if (personal_id) {
        const id = personal_id;
        const personal = await Personal.findByPk(id, {
          include: {
            model: Enderecos,
            attributes: ['id', 'personal_id'],
            order: [['id', 'DESC']],
          },
        });

        if (!personal) {
          return res.status(404).json({
            errors: ['Nenhum personal foi encontrado'],
          });
        }

        if (personal.dataValues.Endereco) {
          return res.status(401).json({
            errors: ['Já há um endereço vinculado a este perfil'],
          });
        }

        endereco = await Enderecos.create(req.body);
      }

      return res.status(200).json(endereco);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async update(req, res) {
    try {
      if (!req.params.id) {
        return res.status(404).json({
          errors: ['Chave não enviada para update'],
        });
      }

      const endereco = await Enderecos.findByPk(req.params.id);

      if (!endereco) {
        return res.status(400).json({
          errors: ['Endereço não encontrado'],
        });
      }

      const novosDados = await endereco.update(req.body);

      return res.status(200).json(novosDados);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async delete(req, res) {
    try {
      if (!req.params.id) {
        return res.status(404).json({
          errors: ['Chave não enviada para delete'],
        });
      }

      const endereco = await Enderecos.findByPk(req.params.id);

      if (!endereco) {
        return res.status(400).json({
          errors: ['Endereço não encontrado'],
        });
      }

      await endereco.destroy();

      return res.status(200).json({
        success: ['Excluido com sucesso'],
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }
}

export default new EnderecosControllers();
