// models/brand.js
export default function BrandModel(sequelize, DataTypes) {
  const Brand = sequelize.define('Brand', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    },
    image: DataTypes.TEXT('long'),
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'brands',
    timestamps: true
  });

  Brand.associate = function(models) {
    Brand.hasMany(models.Product, { foreignKey: 'brandId' });
    Brand.belongsTo(models.User, { 
      foreignKey: 'createdBy',
      as: 'User'
    });
  };

  return Brand;
}