export default function SaleReturnModel(sequelize, DataTypes) {
  return sequelize.define('SaleReturn', {
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
}