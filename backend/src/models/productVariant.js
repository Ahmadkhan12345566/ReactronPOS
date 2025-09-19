export default function ProductVariantModel(sequelize, DataTypes) {
  const ProductVariant = sequelize.define('ProductVariant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sku: { type: DataTypes.STRING },
    itemBarcode: { type: DataTypes.STRING },
    price: DataTypes.DECIMAL(10, 2),
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    weight: { 
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
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
