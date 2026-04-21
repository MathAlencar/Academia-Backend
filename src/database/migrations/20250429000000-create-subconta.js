/** @type {import('sequelize-cli').Migration} */  
module.exports = {  
  async up(queryInterface, Sequelize) {  
    await queryInterface.createTable('subconta', {  
      id: {  
        type: Sequelize.INTEGER,  
        allowNull: false,  
        primaryKey: true,  
        autoIncrement: true,  
      },  
      personal_id: {  
        type: Sequelize.INTEGER,  
        allowNull: false,  
        unique: true,  
        references: {  
          model: 'personal',  
          key: 'id',  
        },  
        onDelete: 'CASCADE',  
        onUpdate: 'CASCADE',  
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
      created_at: {  
        type: Sequelize.DATE,  
        allowNull: false,  
      },  
      updated_at: {  
        type: Sequelize.DATE,  
        allowNull: false,  
      },  
    });  
  },  
  
  async down(queryInterface) {  
    await queryInterface.dropTable('subconta');  
  },  
};