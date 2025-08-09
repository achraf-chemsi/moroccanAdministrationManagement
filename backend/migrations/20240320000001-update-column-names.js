'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update ContractHistories table
    await queryInterface.renameColumn('ContractHistories', 'contractId', 'contract_id');
    await queryInterface.renameColumn('ContractHistories', 'changedById', 'changed_by_id');

    // Update CalendarEvents table
    await queryInterface.renameColumn('CalendarEvents', 'contractId', 'contract_id');
    await queryInterface.renameColumn('CalendarEvents', 'createdById', 'created_by_id');

    // Update Contracts table
    await queryInterface.renameColumn('Contracts', 'createdById', 'created_by_id');
    await queryInterface.renameColumn('Contracts', 'updatedById', 'updated_by_id');

    // Update EventAttendees table
    await queryInterface.renameColumn('EventAttendees', 'eventId', 'event_id');
    await queryInterface.renameColumn('EventAttendees', 'userId', 'user_id');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert ContractHistories table
    await queryInterface.renameColumn('ContractHistories', 'contract_id', 'contractId');
    await queryInterface.renameColumn('ContractHistories', 'changed_by_id', 'changedById');

    // Revert CalendarEvents table
    await queryInterface.renameColumn('CalendarEvents', 'contract_id', 'contractId');
    await queryInterface.renameColumn('CalendarEvents', 'created_by_id', 'createdById');

    // Revert Contracts table
    await queryInterface.renameColumn('Contracts', 'created_by_id', 'createdById');
    await queryInterface.renameColumn('Contracts', 'updated_by_id', 'updatedById');

    // Revert EventAttendees table
    await queryInterface.renameColumn('EventAttendees', 'event_id', 'eventId');
    await queryInterface.renameColumn('EventAttendees', 'user_id', 'userId');
  }
}; 