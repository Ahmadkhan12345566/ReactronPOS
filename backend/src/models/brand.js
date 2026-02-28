import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Brand = sequelize.define('Brand', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active',
  },
  image: {
    type: DataTypes.STRING,
  },
  createdBy: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'brands',
  timestamps: true,
});

export default Brand;
