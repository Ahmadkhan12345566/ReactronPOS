import express from 'express';
import { ProductVariant } from '../models/index.js';
import { toObjectWithId } from '../utils/transform.js';
import { authenticateToken } from '../middleware/auth.js';
import { isValidId } from '../utils/validation.js';

const router = express.Router();

// Create a new product variant
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId, sku, itemBarcode, price, cost, weight, attributes, expiryDate, manufacturedDate } = req.body;

    if (!isValidId(productId)) {
      return res.status(400).json({ error: 'Valid productId is required.' });
    }
    
    const variant = await ProductVariant.create({
      productId: Number(productId),
      sku,
      itemBarcode,
      price,
      cost,
      weight,
      attributes: attributes || {},
      expiryDate,
      manufacturedDate,
      createdBy: Number(req.user.userId),
    });
    
    res.status(201).json(toObjectWithId(variant));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
