// models/customer.js
export default function CustomerModel(sequelize, DataTypes) {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    avatar: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    }
  }, {
    tableName: 'customers',
    timestamps: true
  });

  Customer.associate = function(models) {
    Customer.hasMany(models.Sale, { foreignKey: 'customerId' });
    Customer.hasMany(models.SaleReturn, { foreignKey: 'customerId' });
  };

  return Customer;
}