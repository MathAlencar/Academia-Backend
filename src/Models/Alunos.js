import Sequelize, { Model } from 'sequelize';

export default class Aluno extends Model {
  // Metódo estático.
  static init(sequelize) {
    super.init({
      // Não precisa do ID, já que o model liga ele automaticamente.
      nome: Sequelize.STRING,
      sobrenome: Sequelize.STRING,
      email: Sequelize.STRING,
      idade: Sequelize.INTEGER,
      peso: Sequelize.FLOAT,
      altura: Sequelize.FLOAT,
    }, {
      sequelize,
    }); // Chamando o init da classe model
    return this;
  }
}
