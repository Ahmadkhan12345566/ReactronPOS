import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    // It's recommended to use an environment variable for the database URI
    // For example: process.env.MONGODB_URI
    const dbUri = "mongodb+srv://mash:mash1234@cluster0.nwbrfic.mongodb.net/inventory" ;
    await mongoose.connect(dbUri);
    console.log('MongoDB connected to:', dbUri);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
