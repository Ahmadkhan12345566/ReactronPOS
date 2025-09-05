export default function InventoryModel(sequelize, DataTypes) {
  const Inventory = sequelize.define('Inventory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    variantId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    quantityAlert: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'inventories',
    timestamps: true
  });

  Inventory.associate = function(models) {
    Inventory.belongsTo(models.ProductVariant, { foreignKey: 'variantId', onDelete: 'CASCADE' });
    Inventory.belongsTo(models.Warehouse, { foreignKey: 'warehouseId', onDelete: 'CASCADE' });

    // Reverse lookups
    models.ProductVariant.hasMany(Inventory, { foreignKey: 'variantId', onDelete: 'CASCADE' });
    models.Warehouse.hasMany(Inventory, { foreignKey: 'warehouseId', onDelete: 'CASCADE' });
  };

  return Inventory;
}
