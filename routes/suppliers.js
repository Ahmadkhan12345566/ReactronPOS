import express from 'express';
import { Supplier } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/mongoose.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';

const router = express.Router();

// Get all active suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find({ status: 'Active' });
    res.json(toObjectsWithId(suppliers));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new supplier
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, phone, address, image, status } = req.body;
    const supplier = await Supplier.create({
      name,
      email,
      phone,
      address,
      image,
      status: status || 'Active',
      createdBy: req.user.userId,
    });
    
    res.status(201).json(toObjectWithId(supplier));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
