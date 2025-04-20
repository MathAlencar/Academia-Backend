import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

/* Neste arquivo realizamos a condifgurações das colunas de dados da nossa tabela
Sua função envolve a validação de dado inputado, assim como o manuseio da senha que será enviada ao banco de dados via Hash,
o hook abaixo irá manipular uma variável virutal(não tem no banco de dados, somente no ambiente abaixo), onde sua função é armazenar a senha enviada
pelo usuário, a qual será transformada em hash com esse hook que irá realizar esse procedimento antes de salvar o usuário no banco de dados.
*/

export default class Administrador extends Model {
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
            msg: 'Campo e-mail inválido',
          },
        },
        type: Sequelize.STRING,
      },
      password_hash: {
        defaultValue: '',
        type: Sequelize.INTEGER,
      },
      password: {
        defaultValue: '',
        validate: {
          len: {
            args: [6, 50],
            msg: 'Campo senha deve ter entre 6 a 50 caracteres',
          },
        },
        type: Sequelize.VIRTUAL,
      },
    }, {
      sequelize,
      tableName: 'administrador',
    });

    this.addHook('beforeSave', async (usuario) => {
      if (usuario.password) {
        usuario.password_hash = await bcrypt.hash(usuario.password, 8);
      }
    });

    return this;
  }

  // Função responsável por realizar a validação do usuário.
  passwordIsValida(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
