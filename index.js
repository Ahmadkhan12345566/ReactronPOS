// index.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import productsRoute from "./routes/products.js";
import customersRoute from './routes/customers.js';
import salesRoute from './routes/sales.js';
import categoriesRoute from './routes/categories.js';
import brandsRoute from './routes/brands.js';
import suppliersRoute from './routes/suppliers.js';
import billersRoute from './routes/billers.js';
import storeRoutes from './routes/stores.js';
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
  app.use('/api/stores', storeRoutes);
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
    await connectDB();
    console.log('Database connected successfully');

    const port = process.env.PORT || 3000;
    app.listen(port, 'localhost', () => {
      console.log(`✅ Express server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Startup DB failure', err);
    throw err;
  }
}


const isDev = true || process.env.NODE_ENV === 'development' || process.env.RUN_SERVER === 'true';

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
