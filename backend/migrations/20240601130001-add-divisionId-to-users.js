'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'divisionId', {
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
    await queryInterface.removeColumn('Users', 'divisionId');
  }
}; 