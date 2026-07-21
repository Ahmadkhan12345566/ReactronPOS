import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active',
  },
  image: {
    type: DataTypes.STRING,
  },
  slug: {
    type: DataTypes.STRING,
  },
  sellingType: {
    type: DataTypes.ENUM('Online', 'POS'),
  },
  productType: {
    type: DataTypes.ENUM('single', 'variable'),
    allowNull: false,
  },
  taxType: {
    type: DataTypes.ENUM('Exclusive', 'Inclusive'),
  },
  tax: {
    type: DataTypes.FLOAT,
  },
  discountType: {
    type: DataTypes.ENUM('Percentage', 'Fixed'),
  },
  discountValue: {
    type: DataTypes.FLOAT,
  },
  warranties: {
    type: DataTypes.STRING,
  },
  barcodeSymbology: {
    type: DataTypes.STRING,
  },
  createdBy: {
    type: DataTypes.INTEGER,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    field: 'category',
  },
  subCategoryId: {
    type: DataTypes.INTEGER,
    field: 'subCategory',
  },
  brandId: {
    type: DataTypes.INTEGER,
    field: 'brand',
  },
  unitId: {
    type: DataTypes.INTEGER,
    field: 'unit',
  },
  supplierId: {
    type: DataTypes.INTEGER,
    field: 'supplier',
  },
  isLocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lockedAt: {
    type: DataTypes.DATE,
  },
  lockedBy: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'products',
  timestamps: true,
});

export default Product;
