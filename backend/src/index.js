// index.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './models/index.js';
import { sequelize } from './models/index.js';
import productsRoute from "./routes/products.js";
import customersRoute from './routes/customers.js';
import salesRoute from './routes/sales.js';
import categoriesRoute from './routes/categories.js';
import brandsRoute from './routes/brands.js';
import suppliersRoute from './routes/suppliers.js';
import billersRoute from './routes/billers.js';
import warehouseRoutes from './routes/warehouses.js';
import subCategoryRoutes from './routes/subCategories.js';
import productVariantRoutes from './routes/productVariants.js';
import inventoryRoutes from './routes/inventory.js';
import salesReturnRoutes from './routes/salesReturns.js';
import salesReportRoutes from './routes/salesReports.js';
import invoiceRoutes from './routes/invoices.js';
import { seedDatabase } from './initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function startServer() {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.get('/health', (req, res) => res.send('OK'));
  app.use('/api/products', productsRoute);
  app.use('/api/auth', (await import('./routes/auth.js')).default);
  app.use('/api/sales', salesRoute);
  app.use('/api/customers', customersRoute);
  app.use('/api/categories', categoriesRoute);
  app.use('/api/brands', brandsRoute);
  app.use('/api/units', (await import('./routes/units.js')).default);
  app.use('/api/customers', customersRoute);
  app.use('/api/suppliers', suppliersRoute);
  app.use('/api/purchases', (await import('./routes/purchases.js')).default);
  app.use('/api/purchase/report', (await import("./routes/purchaseRoutes.js")).default);
  app.use('/api/billers', billersRoute);
  app.use('/api/warehouses', warehouseRoutes);
  app.use('/api/sub-categories', subCategoryRoutes);
  app.use('/api/product-variants', productVariantRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/sales/returns', salesReturnRoutes);
  app.use('/api/sales/report', salesReportRoutes);
  app.use('/api/invoices', invoiceRoutes);
  app.use('/api/dashboard', (await import('./routes/dashboard.js')).default);

  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  try {
    await testConnection();
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');

    const port = process.env.PORT || 3000;
    app.listen(port, 'localhost', () => {
      console.log(`✅ Express server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Startup DB failure', err);
    throw err;
  }
}


const isDev = process.env.NODE_ENV === 'development' || process.env.RUN_SERVER === 'true';

if (isDev) {
  startServer()
    .then(() => console.log('Dev server started'))
    .catch(err => {
      console.error('Failed to start dev server', err);
      process.exit(1);
    });
} else {
  console.log('Skipping dev server startup (NODE_ENV != development)');
}






/* 
dummyBillers = [
  {
    id: 1,
    code: 'BL001',
    name: 'Carl Evans',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    email: 'carl.evans@example.com',
    phone: '+1234567890',
    company: 'Apple',
    status: 'Active'
  },
  dummyBrands = [
  {
    id: 1,
    name: 'Lenovo',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Lenovo_logo_2015.svg',
    createdOn: '24 Dec 2024',
    status: 'Active'
  },
  dummyCategories = [
  { id: 1, name: 'Computers', slug: 'computers', createdOn: '24 Dec 2024', status: 'Active' },
   dummyCustomerDueReports = [
  {
    id: 1,
    reference: "INV2011",
    code: "CU006",
    customer: {
      name: "Marsha Betts",
      image: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    totalAmount: 2000,
    paid: 2000,
    due: 0,
    status: "Paid"
  },
  dummyCustomerReports = [
  {
    id: 1,
    reference: "INV2011",
    code: "CU006",
    customer: {
      name: "Marsha Betts",
      image: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    totalOrders: 45,
    amount: 750,
    paymentMethod: "Cash",
    status: "Completed"
  },
  dummyCustomers = [
  {
    id: 1,
    code: 'CU001',
    name: 'Carl Evans',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    email: 'carlevans@example.com',
    phone: '+12163547758',
    country: 'Germany',
    status: 'Active'
  },
  Dummy data for dashboard cards
const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    icon: CurrencyDollarIcon,
    color: "bg-green-100 text-green-600"
  },
  revenueData = [
  { month: 'Jan', revenue: 4000, orders: 120 },
   salesDistribution = [
  { category: 'Food', value: 45, color: '#4F46E5' },
   salesDistribution = [
  { category: 'Food', value: 45, color: '#4F46E5' },
   dummyInvoices = [
  {
    id: 1,
    invoiceNo: 'INV001',
    customer: { 
      name: 'Carl Evans', 
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg' 
    },
    dueDate: '24 Dec 2024',
    amount: 1000,
    paid: 1000,
    amountDue: 0,
    status: 'Paid'
  },
  products = [
  {
    id:  1,
    code: "FD001",
    name: "Beef Burger",
    category: "food",
    brand: "CafeCo",
    price: 7.0,
    unit: "Pc",
    qty: 100,
    image: "assets/img/beef-burger.png",
    createdBy: "Admin",
    createdByAvatar: "assets/img/users/user-default.jpg"
  },
  dummyPurchaseReports = [
  {
    id: 1,
    reference: "PO2025",
    sku: "PT008",
    dueDate: "2024-10-03",
    product: {
      name: "iPhone 14 Pro",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg"
    },
    category: "Phone",
    stockQty: 630,
    purchaseQty: 12,
    purchaseAmount: 2000
  },
  dummyPurchases = [
  { 
    id: 1, 
    reference: 'PT001',
    date: "2024-07-29", 
    supplier: "ABC Supplies", 
    status: "Received",
    total: 5000,
    paid: 5000,
    due: 0,
    paymentStatus: "Paid"
  },
  dummySales = [
  {
    id: 1,
    customer: { 
      name: 'Carl Evans', 
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg' 
    },
    reference: 'SL001',
    date: '24 Dec 2024',
    status: 'Completed',
    grandTotal: 1000,
    paid: 1000,
    due: 0,
    paymentStatus: 'Paid',
    biller: 'Admin'
  },
  dummySalesReports = [
  {
    id: 1,
    sku: "PT008",
    dueDate: "2024-10-03",
    product: {
      name: "iPhone 14 Pro",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg",
      brand: "Apple"
    },
    category: "Phone",
    stockQty: 630,
    soldQty: 12,
    soldAmount: 6480
  },
  dummySalesReturns = [
  {
    id: 1,
    product: { 
      name: 'Lenovo IdeaPad 3', 
      image: '/src/assets/img/beef-burger.png' 
    },
    date: '19 Nov 2022',
    customer: { 
      name: 'Carl Evans', 
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg' 
    },
    status: 'Received',
    total: 1000,
    paid: 1000,
    due: 0,
    paymentStatus: 'Paid'
  },
  dummySuppliers = [
  {
    id: 1,
    code: 'SUP001',
    name: 'Carl Evans',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    email: 'carl.evans@example.com',
    phone: '+1234567890',
    address: '123 Main St',
    products: 'Electronics, Furniture',
    status: 'Active'
  },
  dummyUnits = [
  { id: 1, name: 'Kilograms', shortName: 'kg', productCount: 25, createdOn: '24 Dec 2024', status: 'Active' },
*/
