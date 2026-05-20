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
        asaas_account_id: {  
          type: _sequelize2.default.STRING(50),  
          allowNull: true,  
        },  
        wallet_id: {  
          type: _sequelize2.default.STRING(50),  
          allowNull: true,  
        },  
        api_key_encrypted: {  
          type: _sequelize2.default.STRING(255),  
          allowNull: true,  
        },  
        onboarding_url: {  
          type: _sequelize2.default.STRING(500),  
          allowNull: true,  
        },
        company_type: {  
          type: _sequelize2.default.ENUM('MEI', 'LIMITED', 'INDIVIDUAL', 'ASSOCIATION'),  
          allowNull: true,  
        },
        status_cadastro: {  
          type: _sequelize2.default.ENUM('PENDENTE', 'CONCLUIDO', 'ERRO'),  
          defaultValue: 'PENDENTE',  
        },  
        status_aprovacao: {  
          type: _sequelize2.default.ENUM('PENDENTE', 'APROVADO', 'REJEITADO'),  
          defaultValue: 'PENDENTE',  
        },  
        status_recebimento: {  
          type: _sequelize2.default.ENUM('HABILITADO', 'DESABILITADO', 'PENDENTE'),  
          defaultValue: 'PENDENTE',  
        },
      },  
      {  
        sequelize,  
        tableName: 'subconta',  
      }  
    );  
  
    return this;  
  }  
  
  static associate(models) {  
    this.belongsTo(models.Personal, { foreignKey: 'personal_id' });  
  }  
} exports.default = Subconta;