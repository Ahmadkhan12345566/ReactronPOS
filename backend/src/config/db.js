import sequelize from './database.js';
import '../models/index.js';

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('MySQL connected');
  } catch (error) {
    console.error('MySQL connection error:', error);
    process.exit(1);
  }
};

export default connectDB;

