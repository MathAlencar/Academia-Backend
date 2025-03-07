"use strict";/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fotos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      originalName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      aluno_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // Definindo qual tabela ele irá referenciar.
        references: {
          model: 'alunos',
          key: 'id',
        },
        onDelete: 'CASCADE', // Ao ser apagado o aluno, ele irá apagar todas as fotos enviadas.
        onUpdate: 'CASCADE', // Caso o ID da tabela alunos for alterado, ele irá atualizar a relação com o novo ID do usuário, sendo assim essa validação.
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
    await queryInterface.dropTable('usuarios');
  },
};
