const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ContractComment extends Model {}

ContractComment.init(
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
        model: 'contracts',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parentCommentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'contract_comments',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'ContractComment',
    tableName: 'contract_comments',
    timestamps: true,
  }
);

module.exports = ContractComment; 