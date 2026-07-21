import express from 'express';
import { Store } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/transform.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';
import { isValidId } from '../utils/validation.js';

const router = express.Router();

// Get all active stores
router.get('/', authenticateToken, async (req, res) => {
  try {
    const stores = await Store.findAll({ where: { status: 'Active' } });
    res.json(toObjectsWithId(stores));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single store by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid store id.' });
    }
    const store = await Store.findByPk(id);
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
      createdBy: Number(req.user.userId),
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
    
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid store id.' });
    }

    const [updatedCount] = await Store.update(
      { name, address, status },
      { where: { id: Number(id) } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const store = await Store.findByPk(id);
    res.json(toObjectWithId(store));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a store
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid store id.' });
    }
    const deletedCount = await Store.destroy({ where: { id: Number(id) } });
    
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
