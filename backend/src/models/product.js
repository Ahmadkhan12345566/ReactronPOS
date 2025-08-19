export default function ProductModel(sequelize, DataTypes) {
  return sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: DataTypes.STRING, // SKU
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10, 2),
    cost: DataTypes.DECIMAL(10, 2),
    weight: DataTypes.DECIMAL(10, 2),
    qty: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    },
    image: DataTypes.STRING
  }, {
    tableName: 'products',
    timestamps: true
  });
}