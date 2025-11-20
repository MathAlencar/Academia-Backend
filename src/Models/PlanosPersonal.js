import Sequelize, { Model } from 'sequelize';

export default class PlanosPersonal extends Model {
  static init(sequelize) {
    super.init(
      {
        personal_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        tipo_plano: {
          type: Sequelize.ENUM('Experimental', 'Avulsa', 'Mensal', 'Bimestral', 'Trimestral'),
          allowNull: false,
        },
        valor: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            isDecimal: {
              msg: 'O valor deve ser um número decimal válido.',
            },
            min: {
              args: [0],
              msg: 'O valor deve ser maior que zero.',
            },
          },
        },
      },
      {
        sequelize,
        tableName: 'planos_personal',
        indexes: [
          {
            unique: true,
            fields: ['personal_id', 'tipo_plano'], // garante 1 plano de cada tipo por personal
          },
        ],
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Personal, { foreignKey: 'personal_id' });
  }
}
