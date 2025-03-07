"use strict";const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'usuarios',
      [{
        nome: 'John Doe',
        sobrenome: 'nascimento',
        email: 'teste@teste.com.br',
        password_hash: await bcrypt.hash('123456', 8),
        created_at: new Date(),
        updated_at: new Date(),
      }],
      {},
    );
  },
};
