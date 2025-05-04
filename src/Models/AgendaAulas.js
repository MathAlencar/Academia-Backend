import Sequelize, { Model } from 'sequelize';

export default class AulaAgenda extends Model {
  static init(sequelize) {
    super.init({
      aluno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      personal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      date_init: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      date_end: {
        type: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      endereco: {
        type: Sequelize.STRING,
        allowNull: false,
        validade: {
          len: {
            args: [3, 255],
            msg: 'O endereço informado é inválido',
          },
        },
      },
      status: {
        type: Sequelize.ENUM('pendente', 'aceita', 'recusada', 'cancelada'),
        allowNull: false,
        defaultValue: 'pendente',
        validate: {
          isIn: {
            args: [['pendente', 'aceita', 'recusada', 'cancelada']],
            msg: 'Status inválido. Use: pendente, aceita, recusada ou cancelada.',
          },
        },
      },
    }, {
      sequelize,
      tableName: 'aulas',
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Personal, { foreignKey: 'personal_id' });
    this.belongsTo(models.Alunos, { foreignKey: 'aluno_id' });
  }
}
