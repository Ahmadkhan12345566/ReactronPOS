// models/purchase.js
export default function PurchaseModel(sequelize, DataTypes) {
  const Purchase = sequelize.define('Purchase', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    reference: DataTypes.STRING,
    supplier: DataTypes.STRING,
    date: DataTypes.DATE,
    status: DataTypes.STRING,
    payment_status: DataTypes.ENUM('Paid', 'Unpaid', 'Overdue'),
    total: DataTypes.DECIMAL(10, 2),
    paid: DataTypes.DECIMAL(10, 2),
    due: DataTypes.DECIMAL(10, 2)
  }, {
    tableName: 'purchases',
    timestamps: true
  });

  Purchase.associate = function(models) {
    Purchase.belongsTo(models.Supplier, { foreignKey: 'supplierId' });
    Purchase.hasMany(models.PurchaseItem, { foreignKey: 'purchaseId' });
  };

  return Purchase;
}