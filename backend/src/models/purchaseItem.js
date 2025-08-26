// Create this new file for purchase items
export default function PurchaseItemModel(sequelize, DataTypes) {
  const PurchaseItem = sequelize.define('PurchaseItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    unitPrice: DataTypes.DECIMAL(10, 2),
    discount: DataTypes.DECIMAL(5, 2),
    subtotal: DataTypes.DECIMAL(10, 2)
  }, {
    tableName: 'purchase_items',
    timestamps: true
  });

  PurchaseItem.associate = function(models) {
    PurchaseItem.belongsTo(models.Purchase, { foreignKey: 'purchaseId' });
    PurchaseItem.belongsTo(models.Product, { foreignKey: 'productId' });
  };

  return PurchaseItem;
}
// models/purchaseItem.js