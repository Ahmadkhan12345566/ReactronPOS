import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  variantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'variant',
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'store',
  },
  qty: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  quantityAlert: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'inventories',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['variant', 'store'],
    },
  ],
});

export default Inventory;
