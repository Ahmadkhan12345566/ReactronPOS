import express from 'express';
import { models } from '../models/index.js';

const router = express.Router();

// Get all warehouses
router.get('/', async (req, res) => {
  try {
    const warehouses = await models.Warehouse.findAll({
      where: { status: 'Active' }
    });
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new warehouse
router.post('/', async (req, res) => {
  try {
    const { name, address, status } = req.body;
    
    const warehouse = await models.Warehouse.create({
      name,
      address,
      status: status || 'Active'
    });
    
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;