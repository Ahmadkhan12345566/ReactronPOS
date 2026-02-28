import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ReturnItem = sequelize.define('ReturnItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  saleReturnId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'saleReturn',
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product',
  },
  variantId: {
    type: DataTypes.INTEGER,
    field: 'variant',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'return_items',
  timestamps: true,
});

export default ReturnItem;
