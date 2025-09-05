export default function SubCategoryModel(sequelize, DataTypes) {
  const SubCategory = sequelize.define('SubCategory', {
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
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    tableName: 'sub_categories',
    timestamps: true
  });

  SubCategory.associate = function(models) {
    SubCategory.belongsTo(models.Category, { foreignKey: 'categoryId' });
    SubCategory.hasMany(models.Product, { foreignKey: 'subCategoryId' });
  };

  return SubCategory;
}