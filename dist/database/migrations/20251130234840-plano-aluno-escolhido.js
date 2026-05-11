"use strict";'use strict';  
  
/** @type {import('sequelize-cli').Migration} */  
module.exports = {  
  async up(queryInterface, Sequelize) {  
    await queryInterface.createTable('Cobrancas', {  
      id: {  
        type: Sequelize.INTEGER,  
        allowNull: false,  
        primaryKey: true,  
        autoIncrement: true,  
      },  
      aluno_id: {  
        type: Sequelize.INTEGER,  
        allowNull: false,  
        references: {  
          model: 'alunos',  
          key: 'id',  
        },  
        onDelete: 'CASCADE',  
        onUpdate: 'CASCADE',  
      },  
      plano_id: {  
        type: Sequelize.INTEGER,  
        allowNull: false,  
        references: {  
          model: 'planos_personal',  
          key: 'id',  
        },  
        onDelete: 'CASCADE',  
        onUpdate: 'CASCADE',  
      },  
      payment_link_id: {  
        type: Sequelize.STRING,  
        allowNull: true,  
      },  
      checkout_url: {  
        type: Sequelize.STRING,  
        allowNull: true,  
      },  
      status: {  
        type: Sequelize.STRING,  
        defaultValue: 'PENDING',  
      },  
      value: {  
        type: Sequelize.DECIMAL(10, 2),  
        allowNull: true,  
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
    await queryInterface.dropTable('Cobrancas');  
  },  
};