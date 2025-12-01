"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

 class Cobrancas extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      aluno_id: {
        type: _sequelize2.default.INTEGER,
        allowNull: false,
      },
      plano_id: {
        type: _sequelize2.default.INTEGER,
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
} exports.default = Cobrancas;
