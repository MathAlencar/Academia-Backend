import Aluno from '../../Models/Alunos';
import Foto from '../../Models/FotoAlunos';
import AulaAgenda from '../../Models/AgendaAulas';
import Personal from '../../Models/Personal';
import Enderecos from '../../Models/Enderecos';
import ClienteService from '../../services/pagamento/cliente_service'; 

class AlunoControllers {
 async store(req, res) {
    try {
      const dadosAluno = req.body;
      let clienteAsaas = null;

      // Se tiver CPF/CNPJ, cria o customer no Asaas antes de salvar o aluno
      if (dadosAluno.cpfCnpj) {
        try {
          clienteAsaas = await ClienteService.cadastrarCliente({
            nome: dadosAluno.nome,
            cpfCnpj: dadosAluno.cpfCnpj,
            email: dadosAluno.email,
            telefone: dadosAluno.celular,
          });
        } catch (err) {
          console.error('Erro ao criar cliente no Asaas:', err.response?.data || err.message);
          return res.status(400).json({
            errors: ['Erro ao criar cliente no Asaas. Verifique os dados informados.'],
          });
        }
      }

      // Se criou customer, adiciona cliente_id e cpf_cnpj ao cadastro do aluno
      if (clienteAsaas?.id) {
        dadosAluno.cliente_id = clienteAsaas.id;
        dadosAluno.cpf_cnpj = dadosAluno.cpfCnpj;
      }

      // Cria o aluno no banco
      const novoAluno = await Aluno.create(dadosAluno);

      const { id, nome, email, cliente_id } = novoAluno;
      return res.status(201).json({ id, nome, email, cliente_id });
    } catch (e) {
      console.error('Erro ao criar aluno:', e);
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async index(req, res) {
    try {
      const select = req.query.$select ? req.query.$select.split(',') : null;
      const expand = req.query.$expand ? req.query.$expand.split(',') : null;

      const options = {
        order: [['id', 'DESC']],
        include: [],
      };

      if (select && select.length) {
        options.attributes = select;
      } else {
        options.attributes = ['id', 'nome', 'email'];
      }

      if (expand && expand.includes('foto')) {
        options.include.push({
          model: Foto,
          attributes: ['url', 'filename'],
          order: [['id', 'DESC']],
        });
      }

      if (expand && expand.includes('aulas')) {
        options.include.push({
          model: AulaAgenda,
          attributes: ['id', 'personal_id', 'endereco', 'date_init', 'date_end'],
          order: [['id', 'DESC']],
          include: [
            {
              model: Personal,
              attributes: ['id', 'nome', 'email'],
            },
          ],
        });
      }

      if (expand && expand.includes('endereco')) {
        options.include.push({
          model: Enderecos,
          attributes: ['id', 'personal_id', 'rua', 'cidade'],
          order: [['id', 'DESC']],
        });
      }

      const users = await Aluno.findAll(options);
      return res.json(users);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async show(req, res) {
    try {
      const select = req.query.$select ? req.query.$select.split(',') : null;
      const expand = req.query.$expand ? req.query.$expand.split(',') : null;

      const options = {
        order: [['id', 'DESC']],
        include: [],
      };

      if (select && select.length) {
        options.attributes = select;
      } else {
        options.attributes = ['id', 'nome', 'email'];
      }

      if (expand && expand.includes('foto')) {
        options.include = [{
          model: Foto,
          attributes: ['url', 'filename'],
          order: [['id', 'DESC']],
        }];
      }

      if (expand && expand.includes('aulas')) {
        options.include.push({
          model: AulaAgenda,
          attributes: ['id', 'personal_id', 'status', 'endereco', 'date_init', 'date_end'],
          order: [['id', 'DESC']],
          include: [
            {
              model: Personal,
              attributes: ['id', 'nome', 'email'],
            },
          ],
        });
      }

      if (expand && expand.includes('endereco')) {
        options.include.push({
          model: Enderecos,
          attributes: ['id', 'personal_id', 'rua', 'cidade'],
          order: [['id', 'DESC']],
        });
      }

      const user = await Aluno.findByPk(req.params.id, options);

      if (!user) {
        return res.status(400).json({
          errors: ['Usuário não encontrado em nossa base de dados'],
        });
      }

      return res.status(200).json(user);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

async update(req, res) {
  try {
    const { id } = req.params;
    const { cpfCnpj } = req.body;

    if (!id) {
      return res.status(400).json({
        errors: ['ID do aluno não informado.'],
      });
    }

    const aluno = await Aluno.findByPk(id);

    if (!aluno) {
      return res.status(404).json({
        errors: ['Aluno não encontrado.'],
      });
    }

    // Bloqueia alteração se o CPF já estiver cadastrado e for diferente
    if (aluno.cpf_cnpj && cpfCnpj && aluno.cpf_cnpj !== cpfCnpj) {
      return res.status(400).json({
        errors: ['CPF/CNPJ já cadastrado — não é permitido alterar.'],
      });
    }

    // Caso o aluno ainda não tenha CPF e o usuário informar um novo
    if (!aluno.cpf_cnpj && cpfCnpj) {
      try {
        const clienteAsaas = await ClienteService.cadastrarCliente({
          nome: aluno.nome,
          cpfCnpj,
          email: aluno.email,
          telefone: aluno.celular,
        });

        await aluno.update({
          cpf_cnpj: cpfCnpj,
          cliente_id: clienteAsaas.id,
          ...req.body, // garante atualização dos demais campos
        });

        return res.status(200).json({
          message: 'CPF cadastrado e cliente criado com sucesso no Asaas.',
          cliente_id: clienteAsaas.id,
          cpf_cnpj: cpfCnpj,
        });
      } catch (err) {
        console.error('Erro ao criar cliente no Asaas:', err.response?.data || err.message);
        return res.status(400).json({
          errors: ['Erro ao criar cliente no Asaas. Verifique os dados informados.'],
        });
      }
    }

    // Atualização normal (sem criação de cliente no Asaas)
    // Faz o mapeamento camelCase → snake_case, garantindo persistência
    const dadosAtualizados = { ...req.body };

    if (cpfCnpj && !aluno.cpf_cnpj) {
      dadosAtualizados.cpf_cnpj = cpfCnpj;
    }

    delete dadosAtualizados.cpfCnpj; // remove duplicado

    const alunoAtualizado = await aluno.update(dadosAtualizados);

      // No final do update do aluno
    if (aluno.cpf_cnpj && (req.body.nome || req.body.celular)) {
      try {
        await ClienteService.atualizarClienteAsaas({
          cpfCnpj: aluno.cpf_cnpj,
          nome: req.body.nome,
          telefone: req.body.celular,
        });
      } catch (err) {
        console.error('Falha ao sincronizar dados com o Asaas:', err.message);
      }
    }

    return res.status(200).json({
      message: 'Dados do aluno atualizados com sucesso.',
      data: alunoAtualizado,
    });
    
  } catch (e) {
    console.error('Erro geral na atualização do aluno:', e);
    return res.status(400).json({
      errors: e.errors?.map((err) => err.message) || [e.message],
    });
  }
  }
}

export default new AlunoControllers();
