// models/report.js
export default function ReportModel(sequelize, DataTypes) {
  return sequelize.define('Report', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: DataTypes.STRING, // 'customer', 'purchase', 'due', etc.
    reference: DataTypes.STRING,
    date: DataTypes.DATE,
    amount: DataTypes.DECIMAL(10, 2),
    payment_method: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    customer_name: DataTypes.STRING,
    customer_image: DataTypes.STRING,
    product_name: DataTypes.STRING,
    product_image: DataTypes.STRING,
    category: DataTypes.STRING
  }, {
    tableName: 'reports',
    timestamps: true
  });
}