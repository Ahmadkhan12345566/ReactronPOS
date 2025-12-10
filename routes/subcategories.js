import express from 'express';
import { SubCategory } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/mongoose.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';

const router = express.Router();

// Get all subcategories with their parent category name
router.get('/', async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate('category', 'name');
    res.json(toObjectsWithId(subCategories));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new subcategory
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, status, categoryId } = req.body;
    
    const subCategory = await SubCategory.create({
      name,
      status: status || 'Active',
      category: categoryId, // The Mongoose schema field is 'category'
      createdBy: req.user.userId,
    });
    
    res.status(201).json(toObjectWithId(subCategory));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
