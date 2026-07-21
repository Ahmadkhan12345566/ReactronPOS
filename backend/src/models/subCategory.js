import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SubCategory = sequelize.define('SubCategory', {
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
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'category',
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'sub_categories',
  timestamps: true,
});

export default SubCategory;
