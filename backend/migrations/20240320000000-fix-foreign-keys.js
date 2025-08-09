'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Try to drop existing foreign key constraints if they exist
      try {
        await queryInterface.removeConstraint('ContractHistories', 'ContractHistories_contractId_fkey');
      } catch (error) {
        console.log('ContractHistories constraint not found');
      }

      try {
        await queryInterface.removeConstraint('CalendarEvents', 'CalendarEvents_contractId_fkey');
      } catch (error) {
        console.log('CalendarEvents constraint not found');
      }

      // Rename the columns to avoid conflicts
      try {
        await queryInterface.renameColumn('ContractHistories', 'ContractId', 'contractId');
      } catch (error) {
        console.log('ContractHistories column rename not needed');
      }

      try {
        await queryInterface.renameColumn('CalendarEvents', 'ContractId', 'contractId');
      } catch (error) {
        console.log('CalendarEvents column rename not needed');
      }

      // Add back the foreign key constraints with explicit names
      await queryInterface.addConstraint('ContractHistories', {
        fields: ['contractId'],
        type: 'foreign key',
        name: 'fk_contract_history_contract',
        references: {
          table: 'Contracts',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      await queryInterface.addConstraint('CalendarEvents', {
        fields: ['contractId'],
        type: 'foreign key',
        name: 'fk_calendar_event_contract',
        references: {
          table: 'Contracts',
          field: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove the new foreign key constraints
      try {
        await queryInterface.removeConstraint('ContractHistories', 'fk_contract_history_contract');
      } catch (error) {
        console.log('fk_contract_history_contract constraint not found');
      }

      try {
        await queryInterface.removeConstraint('CalendarEvents', 'fk_calendar_event_contract');
      } catch (error) {
        console.log('fk_calendar_event_contract constraint not found');
      }

      // Rename the columns back
      try {
        await queryInterface.renameColumn('ContractHistories', 'contractId', 'ContractId');
      } catch (error) {
        console.log('ContractHistories column rename not needed');
      }

      try {
        await queryInterface.renameColumn('CalendarEvents', 'contractId', 'ContractId');
      } catch (error) {
        console.log('CalendarEvents column rename not needed');
      }

      // Add back the original foreign key constraints
      await queryInterface.addConstraint('ContractHistories', {
        fields: ['ContractId'],
        type: 'foreign key',
        references: {
          table: 'Contracts',
          field: 'id'
        }
      });

      await queryInterface.addConstraint('CalendarEvents', {
        fields: ['ContractId'],
        type: 'foreign key',
        references: {
          table: 'Contracts',
          field: 'id'
        }
      });
    } catch (error) {
      console.error('Migration rollback error:', error);
      throw error;
    }
  }
}; 