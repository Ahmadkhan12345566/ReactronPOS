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
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    },
    slug: DataTypes.STRING,
    sellingType: DataTypes.ENUM('Online', 'POS'),
    productType: DataTypes.ENUM('single', 'variable'),
    taxType: DataTypes.ENUM('Exclusive', 'Inclusive'),
    tax: DataTypes.DECIMAL(5, 2),
    discountType: DataTypes.ENUM('Percentage', 'Fixed'),
    discountValue: DataTypes.DECIMAL(10, 2),
    warranties: DataTypes.TEXT,
    barcodeSymbology: DataTypes.STRING
  }, {
    tableName: 'products',
    timestamps: true
  });

  Product.associate = function(models) {
    Product.belongsTo(models.User, { foreignKey: 'createdBy' });
    Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
    Product.belongsTo(models.SubCategory, { foreignKey: 'subCategoryId' });
    Product.belongsTo(models.Brand, { foreignKey: 'brandId' });
    Product.belongsTo(models.Unit, { foreignKey: 'unitId' });
    Product.belongsTo(models.Supplier, { foreignKey: 'supplierId' });
    Product.hasMany(models.ProductVariant, { foreignKey: 'productId' });
  };

  return Product;
}