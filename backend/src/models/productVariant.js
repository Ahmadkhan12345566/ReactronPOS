import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProductVariant = sequelize.define('ProductVariant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sku: {
    type: DataTypes.STRING,
  },
  itemBarcode: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
  },
  cost: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  weight: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  attributes: {
    type: DataTypes.JSON,
  },
  expiryDate: {
    type: DataTypes.DATE,
  },
  manufacturedDate: {
    type: DataTypes.DATE,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product',
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'product_variants',
  timestamps: true,
});

export default ProductVariant;
