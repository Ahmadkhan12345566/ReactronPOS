// models/user.js
export default function UserModel(sequelize, DataTypes) {
  return sequelize.define('User', {
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
    role: DataTypes.STRING, // 'biller', 'admin', etc.
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    },
    password: DataTypes.STRING
  }, {
    tableName: 'users',
    timestamps: true
  });
}