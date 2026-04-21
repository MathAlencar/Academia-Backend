/** @type {import('sequelize-cli').Migration} */  
module.exports = {  
  async up(queryInterface, Sequelize) {  
    await queryInterface.createTable('planos_personal', {  
      id: {  
        type: Sequelize.INTEGER,  
        allowNull: false,  
        primaryKey: true,  
        autoIncrement: true,  
      },  
      personal_id: {  
        type: Sequelize.INTEGER,  
        allowNull: false,  
        references: {  
          model: 'personal',  
          key: 'id',  
        },  
        onDelete: 'CASCADE',  
        onUpdate: 'CASCADE',  
      },  
      tipo_plano: {  
        type: Sequelize.ENUM('Experimental', 'Avulsa', 'Mensal', 'Bimestral', 'Trimestral'),  
        allowNull: false,  
      },  
      valor: {  
        type: Sequelize.DECIMAL(10, 2),  
        allowNull: false,  
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
  
    await queryInterface.addIndex('planos_personal', ['personal_id', 'tipo_plano'], {  
      unique: true,  
    });  
  },  
  
  async down(queryInterface) {  
    await queryInterface.dropTable('planos_personal');  
  },  
};