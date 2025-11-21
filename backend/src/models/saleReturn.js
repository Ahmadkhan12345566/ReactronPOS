// backend/src/models/saleReturn.js

export default function SaleReturnModel(sequelize, DataTypes) {
  const SaleReturn = sequelize.define('SaleReturn', {
    // ... (id, date, status, total, paid, due, payment_status)
    
    // ADD THIS FIELD
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: true, // or false if you make it required in the form
      references: {
        model: 'warehouses',
        key: 'id'
      }
    }
  }, {
    tableName: 'sale_returns',
    timestamps: true
  });

  SaleReturn.associate = function(models) {
    SaleReturn.belongsTo(models.Customer, { foreignKey: 'customerId' });
    SaleReturn.belongsTo(models.Sale, { foreignKey: 'saleId' });
    SaleReturn.hasMany(models.ReturnItem, { foreignKey: 'returnId' });
    
    // ADD THIS ASSOCIATION
    SaleReturn.belongsTo(models.Warehouse, { foreignKey: 'warehouseId' });
  };

  return SaleReturn;
}