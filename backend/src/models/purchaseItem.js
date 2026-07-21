import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PurchaseItem = sequelize.define('PurchaseItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  purchaseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'purchase',
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'purchase_items',
  timestamps: true,
});

export default PurchaseItem;
