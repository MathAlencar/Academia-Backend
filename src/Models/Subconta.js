import Sequelize, { Model } from 'sequelize';  
  
export default class Subconta extends Model {  
  static init(sequelize) {  
    super.init(  
      {  
        personal_id: {  
          type: Sequelize.INTEGER,  
          allowNull: false,  
          unique: {  
            msg: 'Esse personal já possui uma subconta cadastrada',  
          },  
        },  
        asaas_account_id: {  
          type: Sequelize.STRING(50),  
          allowNull: true,  
        },  
        wallet_id: {  
          type: Sequelize.STRING(50),  
          allowNull: true,  
        },  
        api_key_encrypted: {  
          type: Sequelize.STRING(255),  
          allowNull: true,  
        },  
        onboarding_url: {  
          type: Sequelize.STRING(500),  
          allowNull: true,  
        },  
        status_cadastro: {  
          type: Sequelize.ENUM('PENDENTE', 'CONCLUIDO', 'ERRO'),  
          defaultValue: 'PENDENTE',  
        },  
        status_aprovacao: {  
          type: Sequelize.ENUM('PENDENTE', 'APROVADO', 'REJEITADO'),  
          defaultValue: 'PENDENTE',  
        },  
        status_recebimento: {  
          type: Sequelize.ENUM('HABILITADO', 'DESABILITADO', 'PENDENTE'),  
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
}