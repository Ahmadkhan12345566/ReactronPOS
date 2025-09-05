export default function SupplierModel(sequelize, DataTypes) {
  const Supplier = sequelize.define('Supplier', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.TEXT('long'),
    status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' }
  }, {
    tableName: 'suppliers',
    timestamps: true
  });

  Supplier.associate = function(models) {
    Supplier.hasMany(models.Product, { foreignKey: 'supplierId', as: 'products' });
  };

  return Supplier;
}
