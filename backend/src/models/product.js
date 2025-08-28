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
    price: DataTypes.DECIMAL(10, 2),
    cost: DataTypes.DECIMAL(10, 2),
    weight: DataTypes.DECIMAL(10, 2),
    qty: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    },
    image: DataTypes.TEXT('long'),
    // New fields from AddProduct form
    store: DataTypes.STRING,
    warehouse: DataTypes.STRING,
    slug: DataTypes.STRING,
    sku: DataTypes.STRING,
    sellingType: DataTypes.ENUM('Online', 'POS'),
    category: DataTypes.STRING,
    subCategory: DataTypes.STRING,
    brand: DataTypes.STRING,
    unit: DataTypes.STRING,
    barcodeSymbology: DataTypes.STRING,
    itemBarcode: DataTypes.STRING,
    productType: DataTypes.ENUM('single', 'variable'),
    taxType: DataTypes.ENUM('Exclusive', 'Inclusive'),
    tax: DataTypes.DECIMAL(5, 2),
    discountType: DataTypes.ENUM('Percentage', 'Fixed'),
    discountValue: DataTypes.DECIMAL(10, 2),
    quantityAlert: DataTypes.INTEGER,
    warranties: DataTypes.TEXT,
    manufacturer: DataTypes.STRING,
    manufacturedDate: DataTypes.DATE,
    expiryDate: DataTypes.DATE
  }, {
    tableName: 'products',
    timestamps: true
  });

  Product.associate = function(models) {
    Product.belongsTo(models.User, { foreignKey: 'createdBy' });
    Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
    Product.belongsTo(models.Brand, { foreignKey: 'brandId' });
    Product.belongsTo(models.Unit, { foreignKey: 'unitId' });
    Product.belongsTo(models.Supplier, { foreignKey: 'supplierId' });
  };

  return Product;
}