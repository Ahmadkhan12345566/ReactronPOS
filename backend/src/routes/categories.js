import express from 'express';
import mongoose from 'mongoose';
import { Category } from '../models/index.js';
import { toObjectWithId } from '../utils/mongoose.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';

const router = express.Router();

const normalizeStatus = (status) => {
  if (!status) return 'Active';
  return ['Active', 'Inactive'].includes(status) ? status : 'Active';
};

router.get('/', authenticateToken, async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    // Format the response
    const formattedCategories = categories.map(category => {
      const categoryData = toObjectWithId(category);
      return {
        ...categoryData,
        createdBy: category.createdBy ? category.createdBy.name : 'Unknown',
      };
    });
    
    res.json(formattedCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, status, image } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required.' });
    }
    
    const category = await Category.create({
      name: name.trim(),
      status: normalizeStatus(status),
      image,
      createdBy: req.user.userId
    });
    
    res.status(201).json(toObjectWithId(category));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid category id.' });
    }
    const { name, status, image } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        status: normalizeStatus(status),
        image,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.json(toObjectWithId(updatedCategory));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid category id.' });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
