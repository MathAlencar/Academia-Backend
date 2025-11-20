"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

 class Subconta extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        personal_id: {
          type: _sequelize2.default.INTEGER,
          allowNull: false,
          unique: {
            msg: 'Esse personal já possui uma subconta cadastrada',
          },
        },
        cpf_cnpj: {
          field: 'cpf_cnpj',
          type: _sequelize2.default.STRING(18),
          allowNull: true,
          validate: {
            len: {
              args: [11, 18],
              msg: 'Campo CPF/CNPJ deve ter entre 11 e 18 caracteres',
            },
          },
          unique: {
            msg: 'CPF/CNPJ já existe',
          },
        },
        conta_id: {
          field: 'conta_id',
          type: _sequelize2.default.STRING(50),
          allowNull: true,
        },
        carteira_id: {
          field: 'carteira_id',
          type: _sequelize2.default.STRING(50),
          allowNull: true,
        },
        data_nascimento: {
          field: 'data_nascimento',
          type: _sequelize2.default.DATEONLY,
          allowNull: true,
          validate: {
            isDate: {
              msg: 'Campo Data de Nascimento deve estar em formato válido (YYYY-MM-DD)',
            },
          },
        },
        renda_mensal: {
          field: 'renda_mensal',
          type: _sequelize2.default.DECIMAL(10, 2),
          allowNull: true,
          validate: {
            isDecimal: {
              msg: 'Campo Renda Mensal deve ser numérico',
            },
          },
        },
        endereco: {
          field: 'endereco',
          type: _sequelize2.default.STRING(255),
          allowNull: true,
        },
        numero_endereco: {
          field: 'numero_endereco',
          type: _sequelize2.default.STRING(10),
          allowNull: true,
        },
        bairro: {
          field: 'bairro',
          type: _sequelize2.default.STRING(100),
          allowNull: true,
        },
        cep: {
          field: 'cep',
          type: _sequelize2.default.STRING(20),
          allowNull: true,
        },
        telefone: {
          field: 'telefone',
          type: _sequelize2.default.STRING(20),
          allowNull: true,
        },
        status: {
          field: 'status',
          type: _sequelize2.default.ENUM('PENDENTE', 'ATIVA', 'ERRO'),
          defaultValue: 'PENDENTE',
        },
        api_key: {
          field: 'api_key',
          type: _sequelize2.default.STRING(100),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'subconta',
        timestamps: false, // pois estamos controlando manualmente os campos criados/atualizados
      }
    );

    return this;
  }

  static assocaite(models) {
    this.belongsTo(models.Personal, { foreignKey: 'personal_id' });
  }
} exports.default = Subconta;
