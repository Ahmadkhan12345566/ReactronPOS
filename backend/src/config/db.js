import mongoose from 'mongoose';
// Dummy comment for testing.
const connectDB = async () => {
  try {
    // It's recommended to use an environment variable for the database URI
    // For example: process.env.MONGODB_URI
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      throw new Error('MONGODB_URI is not set.');
    }
    await mongoose.connect(dbUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;

