import express from 'express';
import { Category, SubCategory } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/transform.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';
import { isValidId } from '../utils/validation.js';

const router = express.Router();

// Get all subcategories with their parent category name
router.get('/', authenticateToken, async (req, res) => {
  try {
    const subCategories = await SubCategory.findAll({
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });
    res.json(toObjectsWithId(subCategories));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new subcategory
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, status, categoryId } = req.body;
    
    if (!isValidId(categoryId)) {
      return res.status(400).json({ error: 'Valid categoryId is required.' });
    }

    const subCategory = await SubCategory.create({
      name,
      status: status || 'Active',
      categoryId: Number(categoryId),
      createdBy: Number(req.user.userId),
    });
    
    res.status(201).json(toObjectWithId(subCategory));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
