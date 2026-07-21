import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
  },
  reference: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
  },
  amount: {
    type: DataTypes.FLOAT,
  },
  payment_method: {
    type: DataTypes.STRING,
  },
  payment_status: {
    type: DataTypes.STRING,
  },
  customer_name: {
    type: DataTypes.STRING,
  },
  customer_image: {
    type: DataTypes.STRING,
  },
  product_name: {
    type: DataTypes.STRING,
  },
  product_image: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'reports',
  timestamps: true,
});

export default Report;
