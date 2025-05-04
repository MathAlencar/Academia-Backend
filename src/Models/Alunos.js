import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

export default class Alunos extends Model {
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
      tableName: 'alunos',
    });

    this.addHook('beforeSave', async (usuario) => {
      if (usuario.password) {
        usuario.password_hash = await bcrypt.hash(usuario.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.AlunoFoto, { foreignKey: 'aluno_id' });
    this.hasMany(models.AulaAgenda, { foreignKey: 'aluno_id' });
    this.hasOne(models.Enderecos, { foreignKey: 'aluno_id' });
  }

  // Função responsável por realizar a validação do usuário.
  passwordIsValida(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
