import express from 'express';
const router = express.Router();
import { Category } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/mongoose.js';
import { authenticateToken } from '../middleware/auth.js';

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().populate('createdBy', 'name');
    
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

import isAdmin from '../middleware/admin.js';
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, status, image } = req.body;
    
    const category = await Category.create({
      name,
      status: status || 'Active',
      image,
      createdBy: req.user.userId
    });
    
    res.status(201).json(toObjectWithId(category));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;