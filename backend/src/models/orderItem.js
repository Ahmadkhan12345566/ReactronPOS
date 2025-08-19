// models/orderItem.js
export default function OrderItemModel(sequelize, DataTypes) {
  return sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    unit_price: DataTypes.DECIMAL(10, 2),
    discount: DataTypes.DECIMAL(5, 2), // percentage
    subtotal: DataTypes.DECIMAL(10, 2)
  }, {
    tableName: 'order_items',
    timestamps: true
  });
}