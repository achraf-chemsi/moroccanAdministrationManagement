'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Users table
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'user'),
        defaultValue: 'user'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Contracts table
    await queryInterface.createTable('Contracts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      contractNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      projectTitle: {
        type: Sequelize.STRING,
        allowNull: false
      },
      partnerEntity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ownerEntity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contractAmount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      mandatedAmount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      remainingBalance: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      physicalProgressRate: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      executionDeadline: {
        type: Sequelize.DATE,
        allowNull: false
      },
      serviceOrderDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM(
          'in_progress',
          'provisionally_received',
          'definitively_received',
          'completed',
          'cancelled'
        ),
        defaultValue: 'in_progress'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      attachments: {
        type: Sequelize.JSON,
        allowNull: true
      },
      version: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      createdById: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      updatedById: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create ContractHistories table
    await queryInterface.createTable('ContractHistories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      contractId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Contracts',
          key: 'id'
        }
      },
      fieldName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      oldValue: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      newValue: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      changeType: {
        type: Sequelize.ENUM('create', 'update', 'delete'),
        allowNull: false
      },
      changedById: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      changeDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create CalendarEvents table
    await queryInterface.createTable('CalendarEvents', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      eventType: {
        type: Sequelize.ENUM(
          'contract_deadline',
          'meeting',
          'inspection',
          'payment_due',
          'other'
        ),
        allowNull: false
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: 'pending'
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      reminder: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      reminderTime: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      contractId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Contracts',
          key: 'id'
        }
      },
      createdById: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create EventAttendees table
    await queryInterface.createTable('EventAttendees', {
      eventId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'CalendarEvents',
          key: 'id'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order
    await queryInterface.dropTable('EventAttendees');
    await queryInterface.dropTable('CalendarEvents');
    await queryInterface.dropTable('ContractHistories');
    await queryInterface.dropTable('Contracts');
    await queryInterface.dropTable('Users');
  }
}; 