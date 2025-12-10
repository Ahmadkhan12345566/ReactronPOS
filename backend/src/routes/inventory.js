import express from 'express';
import { Inventory } from '../models/index.js';
import { toObjectWithId } from '../utils/mongoose.js';

const router = express.Router();

// Create a new inventory entry
router.post('/', async (req, res) => {
  try {
const { variantId, storeId, qty, quantityAlert } = req.body;

    // In Mongoose schema, we named them 'variant' and 'store'
    const inventory = await Inventory.findOneAndUpdate(
      {
        variant: variantId,
        store: storeId,
      },
      { $set: { qty, quantityAlert }, $setOnInsert: { createdBy: req.user.userId } },
      {
        new: true, // Return the modified document rather than the original
        upsert: true, // Create a new document if no documents match the filter
      }
    );
    res.status(201).json(toObjectWithId(inventory));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
