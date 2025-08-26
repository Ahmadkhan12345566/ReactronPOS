// models/orderItem.js
export default function OrderItemModel(sequelize, DataTypes) {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    unit_price: DataTypes.DECIMAL(10, 2),
    discount: DataTypes.DECIMAL(5, 2),
    subtotal: DataTypes.DECIMAL(10, 2)
  }, {
    tableName: 'order_items',
    timestamps: true
  });

  OrderItem.associate = function(models) {
    OrderItem.belongsTo(models.Sale, { foreignKey: 'saleId' });
    OrderItem.belongsTo(models.Product, { foreignKey: 'productId' });
  };

  return OrderItem;
}