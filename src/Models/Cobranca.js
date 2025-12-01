import Sequelize, { Model } from 'sequelize';

export default class Cobrancas extends Model {
  static init(sequelize) {
    super.init({
      aluno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      plano_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'Cobrancas',
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.PlanosPersonal, { foreignKey: 'plano_id' });
    this.belongsTo(models.Alunos, { foreignKey: 'aluno_id' });
  }
}
