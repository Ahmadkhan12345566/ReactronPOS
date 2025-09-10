import express from 'express';
import { models } from '../models/index.js';

const router = express.Router();

// Get all suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await models.Supplier.findAll({
      where: { status: 'Active' }
    });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new supplier
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, image, status } = req.body;
    const supplier = await models.Supplier.create({
      name,
      email,
      phone,
      address,
      image,
      status: status || 'Active'
    });
    
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;