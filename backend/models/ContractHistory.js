const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ContractHistory extends Model {}

ContractHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contractId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Contracts',
        key: 'id',
      },
    },
    fieldName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    oldValue: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    newValue: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    changeType: {
      type: DataTypes.ENUM('create', 'update', 'delete'),
      allowNull: false
    },
    changedById: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'ContractHistory',
    tableName: 'contract_histories',
    timestamps: true,
  }
);

module.exports = ContractHistory; 