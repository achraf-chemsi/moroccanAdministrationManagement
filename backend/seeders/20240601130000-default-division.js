'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Divisions', [
      {
        name: 'Default Division',
        description: 'Default division for existing records',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Divisions', { name: 'Default Division' });
  }
}; 