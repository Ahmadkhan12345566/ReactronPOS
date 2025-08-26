export default function ProductModel(sequelize, DataTypes) {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10, 2),
    cost: DataTypes.DECIMAL(10, 2),
    weight: DataTypes.DECIMAL(10, 2),
    qty: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    },
    image: DataTypes.STRING,
    createdBy: DataTypes.STRING, // Added to match dummy data
    createdByAvatar: DataTypes.STRING // Added to match dummy data
  }, {
    tableName: 'products',
    timestamps: true
  });

  Product.associate = function(models) {
    Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
    Product.belongsTo(models.Brand, { foreignKey: 'brandId' });
    Product.belongsTo(models.Unit, { foreignKey: 'unitId' });
    Product.belongsTo(models.Supplier, { foreignKey: 'supplierId' });
  };

  return Product;
}