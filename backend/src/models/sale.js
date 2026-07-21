import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Sale = sequelize.define('Sale', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reference: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM('Completed', 'Pending'),
  },
  payment_status: {
    type: DataTypes.ENUM('Paid', 'Unpaid', 'Overdue'),
  },
  payment_method: {
    type: DataTypes.STRING,
  },
  subtotal: {
    type: DataTypes.FLOAT,
  },
  discount: {
    type: DataTypes.FLOAT,
  },
  tax: {
    type: DataTypes.FLOAT,
  },
  shipping: {
    type: DataTypes.FLOAT,
  },
  total: {
    type: DataTypes.FLOAT,
  },
  paid: {
    type: DataTypes.FLOAT,
  },
  due: {
    type: DataTypes.FLOAT,
  },
  note: {
    type: DataTypes.TEXT,
  },
  customerId: {
    type: DataTypes.INTEGER,
    field: 'customer',
  },
  userId: {
    type: DataTypes.INTEGER,
    field: 'user',
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'store',
  },
}, {
  tableName: 'sales',
  timestamps: true,
});

export default Sale;
