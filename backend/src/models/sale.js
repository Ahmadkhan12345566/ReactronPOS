export default function SaleModel(sequelize, DataTypes) {
  const Sale = sequelize.define('Sale', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    reference: DataTypes.STRING,
    date: DataTypes.DATE,
    status: DataTypes.ENUM('Completed', 'Pending'),
    payment_status: DataTypes.ENUM('Paid', 'Unpaid', 'Overdue'),
    payment_method: DataTypes.STRING,
    subtotal: DataTypes.DECIMAL(10, 2),
    discount: DataTypes.DECIMAL(10, 2),
    tax: DataTypes.DECIMAL(10, 2),
    shipping: DataTypes.DECIMAL(10, 2),
    total: DataTypes.DECIMAL(10, 2),
    paid: DataTypes.DECIMAL(10, 2),
    due: DataTypes.DECIMAL(10, 2),
    note: DataTypes.TEXT,
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'sales',
    timestamps: true
  });

  Sale.associate = function(models) {
    Sale.belongsTo(models.Customer, { foreignKey: 'customerId' });
    Sale.belongsTo(models.User, { foreignKey: 'userId' });
    Sale.belongsTo(models.Warehouse, { foreignKey: 'warehouseId' });
    Sale.hasMany(models.OrderItem, { foreignKey: 'saleId' });
  };

  return Sale;
}