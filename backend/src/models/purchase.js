import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Purchase = sequelize.define('Purchase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reference: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.STRING,
  },
  payment_status: {
    type: DataTypes.ENUM('Paid', 'Unpaid', 'Overdue'),
  },
  total: {
    type: DataTypes.FLOAT,
  },
  paid: {
    type: DataTypes.FLOAT,
  },
  due: {
    type: DataTypes.FLOAT,
  },
  supplierId: {
    type: DataTypes.INTEGER,
    field: 'supplier',
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'purchases',
  timestamps: true,
});

export default Purchase;
