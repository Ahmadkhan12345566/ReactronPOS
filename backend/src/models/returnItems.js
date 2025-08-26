// Create this new file for return items
export default function ReturnItemModel(sequelize, DataTypes) {
  const ReturnItem = sequelize.define('ReturnItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    unitPrice: DataTypes.DECIMAL(10, 2),
    reason: DataTypes.TEXT,
    subtotal: DataTypes.DECIMAL(10, 2)
  }, {
    tableName: 'return_items',
    timestamps: true
  });

  ReturnItem.associate = function(models) {
    ReturnItem.belongsTo(models.SaleReturn, { foreignKey: 'returnId' });
    ReturnItem.belongsTo(models.Product, { foreignKey: 'productId' });
  };

  return ReturnItem;
}