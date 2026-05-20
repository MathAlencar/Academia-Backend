"use strict";/** @type {import('sequelize-cli').Migration} */  
module.exports = {  
  async up(queryInterface, Sequelize) {  
    await queryInterface.addColumn('subconta', 'company_type', {  
      type: Sequelize.ENUM('MEI', 'LIMITED', 'INDIVIDUAL', 'ASSOCIATION'),  
      allowNull: true,  
      after: 'onboarding_url',  
    });  
  },  
  
  async down(queryInterface) {  
    await queryInterface.removeColumn('subconta', 'company_type');  
    await queryInterface.sequelize.query(  
      "DROP TYPE IF EXISTS \"enum_subconta_company_type\";"  
    );  
  },  
};