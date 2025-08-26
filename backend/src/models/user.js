export default function UserModel(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    company: DataTypes.STRING,
    avatar: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('admin', 'biller'),
      defaultValue: 'biller'
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    },
    password: DataTypes.STRING
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = function(models) {
    User.hasMany(models.Sale, { foreignKey: 'userId' });
  };

  return User;
}