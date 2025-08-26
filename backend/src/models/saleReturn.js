export default function SaleReturnModel(sequelize, DataTypes) {
  const SaleReturn = sequelize.define('SaleReturn', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM('Received', 'Pending'),
      defaultValue: 'Pending'
    },
    total: DataTypes.DECIMAL(10, 2),
    paid: DataTypes.DECIMAL(10, 2),
    due: DataTypes.DECIMAL(10, 2),
    payment_status: {
      type: DataTypes.ENUM('Paid', 'Unpaid', 'Overdue'),
      defaultValue: 'Unpaid'
    }
  }, {
    tableName: 'sale_returns',
    timestamps: true
  });

  SaleReturn.associate = function(models) {
    SaleReturn.belongsTo(models.Customer, { foreignKey: 'customerId' });
    SaleReturn.belongsTo(models.Sale, { foreignKey: 'saleId' });
    SaleReturn.hasMany(models.ReturnItem, { foreignKey: 'returnId' });
  };

  return SaleReturn;
}