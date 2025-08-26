export default function SupplierModel(sequelize, DataTypes) {
  return sequelize.define('Supplier', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    products: DataTypes.STRING, // Comma-separated list or JSON
    avatar: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    }
  }, {
    tableName: 'suppliers',
    timestamps: true
  });
}