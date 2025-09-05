export default function WarehouseModel(sequelize, DataTypes) {
  const Warehouse = sequelize.define('Warehouse', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    }
  }, {
    tableName: 'warehouses',
    timestamps: true
  });

  Warehouse.associate = function(models) {
    // Inventory handles relation with ProductVariant
    Warehouse.hasMany(models.Inventory, { foreignKey: 'warehouseId', onDelete: 'CASCADE' });
  };

  return Warehouse;
}
