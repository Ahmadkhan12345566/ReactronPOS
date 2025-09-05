import express from 'express';
import { models } from '../models/index.js';

const router = express.Router();

// Get all purchases with supplier information
router.get('/', async (req, res) => {
  try {
    const purchases = await models.Purchase.findAll({
      include: [{
        model: models.Supplier,
        attributes: ['id', 'name', 'email', 'phone']
      }]
    });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new purchase
router.post('/', async (req, res) => {
  try {
    const { reference, date, status, payment_status, total, paid, due, supplierId } = req.body;
    
    const purchase = await models.Purchase.create({
      reference,
      date: date || new Date(),
      status,
      payment_status,
      total: parseFloat(total) || 0,
      paid: parseFloat(paid) || 0,
      due: parseFloat(due) || 0,
      supplierId: parseInt(supplierId)
    });
    
    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;