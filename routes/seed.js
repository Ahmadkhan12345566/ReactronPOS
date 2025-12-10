import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Store, ProductVariant, Inventory } from '../src/models/index.js';

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

const STORE_NAME = 'islamabad-main';
const DEFAULT_QTY = 100;

const seedDatabase = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in your .env file.');
    process.exit(1);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected successfully.');

    // 1. Find or create the main store
    let store = await Store.findOne({ name: STORE_NAME }).session(session);
    if (!store) {
      console.log(`Store "${STORE_NAME}" not found. Creating it...`);
      [store] = await Store.create([{ name: STORE_NAME, address: 'Islamabad' }], { session });
      console.log(`Store "${STORE_NAME}" created with ID: ${store._id}`);
    } else {
      console.log(`Store "${STORE_NAME}" already exists with ID: ${store._id}`);
    }

    // 2. Get all product variants
    const variants = await ProductVariant.find({}).session(session);
    console.log(`Found ${variants.length} product variants to process.`);

    // 3. Create inventory for each variant in the store
    for (const variant of variants) {
      await Inventory.findOneAndUpdate(
        { variant: variant._id, store: store._id },
        { $setOnInsert: { qty: DEFAULT_QTY, quantityAlert: 10 } },
        { upsert: true, session }
      );
    }

    console.log(`Successfully created/updated inventory for ${variants.length} variants in store "${STORE_NAME}".`);

    await session.commitTransaction();
    console.log('Seeding complete!');
  } catch (error) {
    await session.abortTransaction();
    console.error('An error occurred during the seeding process:', error);
  } finally {
    session.endSession();
    mongoose.disconnect();
  }
};

seedDatabase();