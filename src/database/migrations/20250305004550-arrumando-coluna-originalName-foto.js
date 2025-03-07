/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.renameColumn('fotos', 'originalName', 'original_name');
  },

  async down(queryInterface) {
    await queryInterface.renameColumn('fotos', 'original_name', 'originalName');
  },
};
