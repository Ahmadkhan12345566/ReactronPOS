import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SaleReturn = sequelize.define('SaleReturn', {
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
    type: DataTypes.ENUM('Pending', 'Completed'),
    defaultValue: 'Pending',
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paid: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  due: {
    type: DataTypes.FLOAT,
  },
  payment_status: {
    type: DataTypes.ENUM('Paid', 'Unpaid', 'Overdue'),
    defaultValue: 'Unpaid',
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'customer',
  },
  saleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'sale',
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'store',
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'sale_returns',
  timestamps: true,
});

export default SaleReturn;
