// models/brand.js
export default function BrandModel(sequelize, DataTypes) {
  const Brand = sequelize.define('Brand', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    }
  }, {
    tableName: 'brands',
    timestamps: true
  });

  Brand.associate = function(models) {
    Brand.hasMany(models.Product, { foreignKey: 'brandId' });
  };

  return Brand;
}