// src/models/index.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
//Setup
dotenv.config();

const {
  DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, NODE_ENV
} = process.env;
 const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT ? Number(DB_PORT) : 3306,
  dialect: 'mysql',
  logging: NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    // e.g. support for timezone/charset if needed
  },
  define: {
    underscored: true,
    freezeTableName: false,
    timestamps: true
  }
});

export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('DB connected.');
  } catch (err) {
    console.error('Unable to connect to DB:', err);
    throw err;
  }
}



// Import all models
import UserModel from './user.js';
import CustomerModel from './customer.js';
import ProductModel from './product.js';
import CategoryModel from './category.js';
import BrandModel from './brand.js';
import SupplierModel from './supplier.js';
import UnitModel from './unit.js';
import SaleModel from './sale.js';
import PurchaseModel from './purchase.js';
import SaleReturnModel from './saleReturn.js';
// (import any other model factories here)

/* Initialize models (IMPORTANT: pass DataTypes as second arg) */
const models = {
  User: UserModel(sequelize, Sequelize.DataTypes),
  Customer: CustomerModel(sequelize, Sequelize.DataTypes),
  Product: ProductModel(sequelize, Sequelize.DataTypes),
  Category: CategoryModel(sequelize, Sequelize.DataTypes),
  Brand: BrandModel(sequelize, Sequelize.DataTypes),
  Supplier: SupplierModel(sequelize, Sequelize.DataTypes),
  Unit: UnitModel(sequelize, Sequelize.DataTypes),
  Sale: SaleModel(sequelize, Sequelize.DataTypes),
  Purchase: PurchaseModel(sequelize, Sequelize.DataTypes),
  SaleReturn: SaleReturnModel(sequelize, Sequelize.DataTypes),
  // add others here...
};

/* If any models define `associate(models)` call them now */
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

/* Optional: if some of your model files attach associations as functions on the model
   (e.g. model.associate = function(models) { ... }), the above will call them.
*/

/* Helpful exports */
export { sequelize, Sequelize, models };
export const {
  User,
  Customer,
  Product,
  Category,
  Brand,
  Supplier,
  Unit,
  Sale,
  Purchase,
  SaleReturn,
} = models;