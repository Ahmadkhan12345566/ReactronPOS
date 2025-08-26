// models/category.js
export default function CategoryModel(sequelize, DataTypes) {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    }
  }, {
    tableName: 'categories',
    timestamps: true
  });

  Category.associate = function(models) {
    Category.hasMany(models.Product, { foreignKey: 'categoryId' });
  };

  return Category;
}