import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Unit = sequelize.define('Unit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  short_name: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active',
  },
  createdBy: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'units',
  timestamps: true,
});

export default Unit;
