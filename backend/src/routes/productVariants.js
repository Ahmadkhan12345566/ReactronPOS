import express from 'express';
import { models } from '../models/index.js';

const router = express.Router();

// Create a new product variant
router.post('/', async (req, res) => {
  try {
    const { productId, sku, itemBarcode, price, cost, weight, attributes, expiryDate, manufacturedDate } = req.body;
    
    const variant = await models.ProductVariant.create({
      productId,
      sku,
      itemBarcode,
      price,
      cost,
      weight,
      attributes: attributes || {},
      expiryDate,
      manufacturedDate
    });
    
    res.status(201).json(variant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;