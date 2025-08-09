const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class DepartmentHistory extends Model {}

DepartmentHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Departments',
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
    modelName: 'DepartmentHistory',
    tableName: 'department_histories',
    timestamps: true,
  }
);

module.exports = DepartmentHistory; 