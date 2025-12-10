import express from 'express';
import { Warehouse } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/mongoose.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';

const router = express.Router();

// Get all active warehouses
router.get('/', async (req, res) => {
  try {
    const warehouses = await Warehouse.find({ status: 'Active' });
    res.json(toObjectsWithId(warehouses));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new warehouse
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, address, status } = req.body;
    
    const warehouse = await Warehouse.create({
      name,
      address,
      status: status || 'Active',
      createdBy: req.user.userId,
    });
    
    res.status(201).json(toObjectWithId(warehouse));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
