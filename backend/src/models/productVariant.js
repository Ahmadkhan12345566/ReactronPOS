export default function ProductVariantModel(sequelize, DataTypes) {
  const ProductVariant = sequelize.define('ProductVariant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sku: { type: DataTypes.STRING, unique: true },
    itemBarcode: { type: DataTypes.STRING, unique: true },
    price: DataTypes.DECIMAL(10, 2),
    cost: DataTypes.DECIMAL(10, 2),
    weight: DataTypes.DECIMAL(10, 2),
    attributes: DataTypes.JSON, // For variable products
    expiryDate: DataTypes.DATE,
    manufacturedDate: DataTypes.DATE,
    productId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'product_variants',
    timestamps: true
  });

  ProductVariant.associate = function(models) {
    ProductVariant.belongsTo(models.Product, { foreignKey: 'productId', onDelete: 'CASCADE' });
    // Inventory association is defined in Inventory model for two-way link
  };

  return ProductVariant;
}
