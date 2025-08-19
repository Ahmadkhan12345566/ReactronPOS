import express from 'express';
import { testConnection } from './models/index.js';
import { sequelize } from './models/index.js';

const app = express();

// parse JSON
app.use(express.json());

// simple route
app.get('/health', (req, res) => res.send('OK'));

// test DB and sync on startup (only for dev)
(async () => {
  try {
    await testConnection();
    // WARNING: don't use sync({ force: true }) in production
    // Option A: for dev quick start:
    await sequelize.sync({ alter: true }); // tries to alter tables to match models
    app.listen(3000, () => console.log('Listening on 3000'));
  } catch (err) {
    console.error('Startup DB failure', err);
    process.exit(1);
  }
})();
