const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Contract = require('./Contract');

const CalendarEvent = sequelize.define('CalendarEvent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  eventType: {
    type: DataTypes.ENUM(
      'contract_deadline',
      'meeting',
      'inspection',
      'payment_due',
      'other'
    ),
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reminder: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  reminderTime: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'CalendarEvents',
  timestamps: true,
  underscored: true
});

// Define associations
CalendarEvent.belongsTo(User, { 
  as: 'eventCreator', 
  foreignKey: 'created_by_id'
});

CalendarEvent.belongsTo(Contract, { 
  foreignKey: 'contract_id',
  allowNull: true 
});

CalendarEvent.belongsToMany(User, {
  through: 'EventAttendees',
  foreignKey: 'event_id',
  otherKey: 'user_id',
  as: 'eventAttendees'
});

module.exports = CalendarEvent; 