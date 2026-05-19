"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _appConfig = require('../config/appConfig'); var _appConfig2 = _interopRequireDefault(_appConfig);

 class Diploma extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      originalname: {
        type: _sequelize2.default.STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Campo não pode ficar vazio',
          },
        },
      },
      filename: {
        type: _sequelize2.default.STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Campo não pode ficar vazio',
          },
        },
      },
      status: {
        type: _sequelize2.default.ENUM('Aprovado', 'Validação', "Negado"),
        allowNull: false,
        defaultValue: 'Validação',
        validate: {
            isIn: {
                args: [['Aprovado', 'Validação', 'Negado']],
                msg: 'Status deve ser "Aprovado", "Validação" ou "Negado".',
            },
        },
      },
      url: {
        type: _sequelize2.default.VIRTUAL,
        get() {
          return `${_appConfig2.default.url}/images/${this.getDataValue('filename')}`;
        },
      },
    }, {
      sequelize,
      tableName: 'documento_pessoal_Diploma',
    });
    
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Personal, { foreignKey: 'personal_id' });
  }
} exports.default = Diploma;
