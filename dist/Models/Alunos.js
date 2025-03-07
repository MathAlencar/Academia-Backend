"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

 class Aluno extends _sequelize.Model {
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
        type: _sequelize2.default.STRING,
      },
      sobrenome: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo sobrenome deve ter entre 3 a 255 caracteres',
          },
        },
        type: _sequelize2.default.STRING,
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
        type: _sequelize2.default.STRING,
      },
      idade: {
        defaultValue: 0,
        validate: {
          isInt: {
            msg: 'Por favor informe um número válido',
          },
        },
        type: _sequelize2.default.INTEGER,
      },
      peso: {
        defaultValue: 0,
        validate: {
          isFloat: {
            msg: 'Por favor informe um peso válido',
          },
        },
        type: _sequelize2.default.FLOAT,
      },
      altura: {
        defaultValue: 0,
        validate: {
          isFloat: {
            msg: 'Por favor informe uma altura válida',
          },
        },
        type: _sequelize2.default.FLOAT,
      },
    }, {
      sequelize,
      tableName: 'alunos',
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Foto, { foreignKey: 'aluno_id' });
  }
} exports.default = Aluno;
