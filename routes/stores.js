import express from 'express';
import { Store } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/mongoose.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';

const router = express.Router();

// Get all active stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find({ status: 'Active' });
    res.json(toObjectsWithId(stores));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single store by ID
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(toObjectWithId(store));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new store
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, address, status } = req.body;
    
    const store = await Store.create({
      name,
      address,
      status: status || 'Active',
      createdBy: req.user.userId,
    });
    
    res.status(201).json(toObjectWithId(store));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a store
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, address, status } = req.body;
    
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { name, address, status },
      { new: true }
    );
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    res.json(toObjectWithId(store));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a store
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
