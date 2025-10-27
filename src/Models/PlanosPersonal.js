import Sequelize, { Model } from 'sequelize';

export default class PlanosPersonal extends Model {
  static init(sequelize) {
    super.init({
      tipo_plano: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Campo tipo_plano não pode ficar vazio',
          },
          len: {
            args: [3, 20],
            msg: 'Campo tipo_plano deve ter entre 3 e 20 caracteres',
          },
        },
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: {
            msg: 'Campo valor deve ser numérico',
          },
          min: {
            args: [0],
            msg: 'Campo valor deve ser maior ou igual a zero',
          },
        },
      },
    }, {
      sequelize,
      tableName: 'planos_personal',
      indexes: [
        {
          unique: true,
          fields: ['personal_id', 'tipo_plano'],
        },
      ],
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Personal, {
      foreignKey: 'personal_id',
      as: 'personal',
    });
  }
}
