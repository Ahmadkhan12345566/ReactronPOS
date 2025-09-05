import express from 'express';
import { models } from '../models/index.js';

const router = express.Router();

// Create a new inventory entry
router.post('/', async (req, res) => {
  try {
    const { variantId, warehouseId, qty, quantityAlert } = req.body;
    
    const inventory = await models.Inventory.create({
      variantId,
      warehouseId,
      qty,
      quantityAlert
    });
    
    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;