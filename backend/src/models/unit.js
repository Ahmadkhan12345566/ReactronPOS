// models/unit.js
export default function UnitModel(sequelize, DataTypes) {
  const Unit = sequelize.define('Unit', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    short_name: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'units',
    timestamps: true
  });

  Unit.associate = function(models) {
    Unit.hasMany(models.Product, { foreignKey: 'unitId' });
    Unit.belongsTo(models.User, { 
      foreignKey: 'createdBy',
      as: 'User'
    });
  };

  return Unit;
}