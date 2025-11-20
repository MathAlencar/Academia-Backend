"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

 class PlanosPersonal extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        personal_id: {
          type: _sequelize2.default.INTEGER,
          allowNull: false,
        },
        tipo_plano: {
          type: _sequelize2.default.ENUM('Experimental', 'Avulsa', 'Mensal', 'Bimestral', 'Trimestral'),
          allowNull: false,
        },
        valor: {
          type: _sequelize2.default.DECIMAL(10, 2),
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
} exports.default = PlanosPersonal;
