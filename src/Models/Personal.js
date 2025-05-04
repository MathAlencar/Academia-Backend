import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

export default class Personal extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo nome deve ter entre 3 a 255 caracteres',
          },
        },
        type: Sequelize.STRING,
      },
      email: {
        defaultValue: '',
        unique: {
          msg: 'Email já existe',
        },
        validate: {
          isEmail: {
            msg: 'Campo e-mail inválido!',
          },
        },
        type: Sequelize.STRING,
      },
      password_hash: {
        defaultValue: '',
        type: Sequelize.STRING,
      },
      password: {
        defaultValue: '',
        validate: {
          len: {
            args: [6, 50],
            msg: 'Informe uma senha entre 6 a 50 caracteres',
          },
        },
        type: Sequelize.VIRTUAL,
      },
    }, {
      sequelize,
      tableName: 'personal',
    });

    this.addHook('beforeSave', async (usuario) => {
      if (usuario.password) {
        usuario.password_hash = await bcrypt.hash(usuario.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.PersonalFoto, { foreignKey: 'personal_id' });
    this.hasOne(models.Enderecos, { foreignKey: 'personal_id' });
    this.hasMany(models.PersonalAgenda, { foreignKey: 'personal_id' });
    this.hasMany(models.AulaAgenda, { foreignKey: 'personal_id' });
  }

  // Relações com outras tabelas;
  // Relação com a tabela de alunos -> muitos para muitos
  // Relação com a tabela de foto -> um personal para muitas fotos;
  // Relação com a tabela de espercialização -> muitos para muitos;
  // Relação com a tabela de calendário_inativo -> um personal para muitas linhas de inatividade (caso linha adicionada estiver em uma data inválida, não autorizar);

  // Função responsável por realizar a validação do usuário.
  passwordIsValida(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
