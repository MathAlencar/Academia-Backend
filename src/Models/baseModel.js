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

    }, {
      sequelize,
      tableName: 'aulas',
    });

    // Caso tiver login
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
