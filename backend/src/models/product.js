// backend/src/models/product.js

export default function ProductModel(sequelize, DataTypes) {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true // <-- ADD THIS
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    },
    image: {
      type: DataTypes.TEXT('long'),
      allowNull: true // <-- ADD THIS
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true // <-- ADD THIS
    },
    sellingType: {
      type: DataTypes.ENUM('Online', 'POS'),
      allowNull: true // <-- ADD THIS
    },
    productType: {
      type: DataTypes.ENUM('single', 'variable'),
      allowNull: false // This should be required
    },
    taxType: {
      type: DataTypes.ENUM('Exclusive', 'Inclusive'),
      allowNull: true // <-- ADD THIS
    },
    tax: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true, // <-- ADD THIS
      defaultValue: null // <-- ADD THIS
    },
    discountType: {
      type: DataTypes.ENUM('Percentage', 'Fixed'),
      allowNull: true // <-- ADD THIS
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // <-- ADD THIS
      defaultValue: null // <-- ADD THIS
    },
    warranties: {
      type: DataTypes.TEXT,
      allowNull: true // <-- ADD THIS
    },
    barcodeSymbology: {
      type: DataTypes.STRING,
      allowNull: true // <-- ADD THIS
    }
  }, {
    tableName: 'products',
    timestamps: true
  });

  Product.associate = function(models) {
    // These foreign keys must also allow null
    Product.belongsTo(models.User, { foreignKey: { name: 'createdBy', allowNull: true } });
    Product.belongsTo(models.Category, { foreignKey: { name: 'categoryId', allowNull: true } });
    Product.belongsTo(models.SubCategory, { foreignKey: { name: 'subCategoryId', allowNull: true } });
    Product.belongsTo(models.Brand, { foreignKey: { name: 'brandId', allowNull: true } });
    Product.belongsTo(models.Unit, { foreignKey: { name: 'unitId', allowNull: true } });
    Product.belongsTo(models.Supplier, { foreignKey: { name: 'supplierId', allowNull: true } });
    
    Product.hasMany(models.ProductVariant, { foreignKey: 'productId' });
  };

  return Product;
}