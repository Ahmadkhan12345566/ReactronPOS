import express from 'express';
import { ProductVariant } from '../models/index.js';
import { toObjectWithId } from '../utils/mongoose.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create a new product variant
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId, sku, itemBarcode, price, cost, weight, attributes, expiryDate, manufacturedDate } = req.body;
    
    const variant = await ProductVariant.create({
      product: productId, // Schema uses 'product'
      sku,
      itemBarcode,
      price,
      cost,
      weight,
      attributes: attributes || {},
      expiryDate,
      manufacturedDate,
      createdBy: req.user.userId,
    });
    
    res.status(201).json(toObjectWithId(variant));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
