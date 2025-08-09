'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Contracts', 'divisionId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Divisions',
        key: 'id'
      },
      defaultValue: 1
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Contracts', 'divisionId');
  }
}; 