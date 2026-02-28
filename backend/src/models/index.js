import Brand from './brand.js';
import Category from './category.js';
import Customer from './customer.js';
import Inventory from './inventory.js';
import OrderItem from './orderItem.js';
import Product from './product.js';
import ProductVariant from './productVariant.js';
import Purchase from './purchase.js';
import PurchaseItem from './purchaseItem.js';
import Report from './report.js';
import ReturnItem from './returnItems.js';
import Sale from './sale.js';
import SaleReturn from './saleReturn.js';
import SubCategory from './subCategory.js';
import Supplier from './supplier.js';
import Unit from './unit.js';
import User from './user.js';
import Store from './store.js';
import Warehouse from './warehouse.js';

Brand.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });
User.hasMany(Brand, { as: 'brands', foreignKey: 'createdBy' });

Category.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });
User.hasMany(Category, { as: 'categories', foreignKey: 'createdBy' });

Customer.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });
User.hasMany(Customer, { as: 'customers', foreignKey: 'createdBy' });

Supplier.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });
User.hasMany(Supplier, { as: 'suppliers', foreignKey: 'createdBy' });

Unit.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });
User.hasMany(Unit, { as: 'units', foreignKey: 'createdBy' });

Store.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });
User.hasMany(Store, { as: 'stores', foreignKey: 'createdBy' });

Warehouse.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });
User.hasMany(Warehouse, { as: 'warehouses', foreignKey: 'createdBy' });

SubCategory.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });
Category.hasMany(SubCategory, { as: 'subCategories', foreignKey: 'categoryId' });
SubCategory.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });
User.hasMany(SubCategory, { as: 'subCategories', foreignKey: 'createdBy' });

Product.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });
Product.belongsTo(SubCategory, { as: 'subCategory', foreignKey: 'subCategoryId' });
Product.belongsTo(Brand, { as: 'brand', foreignKey: 'brandId' });
Product.belongsTo(Unit, { as: 'unit', foreignKey: 'unitId' });
Product.belongsTo(Supplier, { as: 'supplier', foreignKey: 'supplierId' });
Product.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });
Product.belongsTo(User, { as: 'lockedByUser', foreignKey: 'lockedBy' });
Product.hasMany(ProductVariant, { as: 'ProductVariants', foreignKey: 'productId' });

ProductVariant.belongsTo(Product, { as: 'product', foreignKey: 'productId' });
ProductVariant.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });
ProductVariant.hasMany(Inventory, { as: 'inventories', foreignKey: 'variantId' });

Inventory.belongsTo(ProductVariant, { as: 'variant', foreignKey: 'variantId' });
Inventory.belongsTo(Store, { as: 'store', foreignKey: 'storeId' });
Store.hasMany(Inventory, { as: 'inventories', foreignKey: 'storeId' });

Sale.belongsTo(Customer, { as: 'customer', foreignKey: 'customerId' });
Sale.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Sale.belongsTo(Store, { as: 'store', foreignKey: 'storeId' });
Sale.hasMany(OrderItem, { as: 'items', foreignKey: 'saleId' });

OrderItem.belongsTo(Sale, { as: 'sale', foreignKey: 'saleId' });
OrderItem.belongsTo(Product, { as: 'product', foreignKey: 'productId' });
OrderItem.belongsTo(ProductVariant, { as: 'variant', foreignKey: 'variantId' });

Purchase.belongsTo(Supplier, { as: 'supplier', foreignKey: 'supplierId' });
Purchase.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });
Purchase.hasMany(PurchaseItem, { as: 'items', foreignKey: 'purchaseId' });

PurchaseItem.belongsTo(Purchase, { as: 'purchase', foreignKey: 'purchaseId' });
PurchaseItem.belongsTo(Product, { as: 'product', foreignKey: 'productId' });

SaleReturn.belongsTo(Customer, { as: 'customer', foreignKey: 'customerId' });
SaleReturn.belongsTo(Sale, { as: 'sale', foreignKey: 'saleId' });
SaleReturn.belongsTo(Store, { as: 'store', foreignKey: 'storeId' });
SaleReturn.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });
SaleReturn.hasMany(ReturnItem, { as: 'items', foreignKey: 'saleReturnId' });

ReturnItem.belongsTo(SaleReturn, { as: 'saleReturn', foreignKey: 'saleReturnId' });
ReturnItem.belongsTo(Product, { as: 'product', foreignKey: 'productId' });
ReturnItem.belongsTo(ProductVariant, { as: 'variant', foreignKey: 'variantId' });

export {
  Brand,
  Category,
  Customer,
  Inventory,
  OrderItem,
  Product,
  ProductVariant,
  Purchase,
  PurchaseItem,
  Report,
  ReturnItem,
  Sale,
  SaleReturn,
  SubCategory,
  Supplier,
  Unit,
  User,
  Store,
  Warehouse,
};
