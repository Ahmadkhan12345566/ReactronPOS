// models/category.js
export default function CategoryModel(sequelize, DataTypes) {
  const Category = sequelize.define('Category', {
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
    tableName: 'categories',
    timestamps: true
  });

  Category.associate = function(models) {
    Category.hasMany(models.Product, { foreignKey: 'categoryId' });
    Category.belongsTo(models.User, { 
      foreignKey: 'createdBy',
      as: 'User'
    });
  };

  return Category;
}