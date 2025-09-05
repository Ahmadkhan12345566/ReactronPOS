import express from 'express';
import { models } from '../models/index.js';

const router = express.Router();

// Get all subcategories
router.get('/', async (req, res) => {
  try {
    const subCategories = await models.SubCategory.findAll({
      include: [
        {
          model: models.Category,
          attributes: ['name']
        }
      ]
    });
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new subcategory
router.post('/', async (req, res) => {
  try {
    const { name, status, categoryId } = req.body;
    
    const subCategory = await models.SubCategory.create({
      name,
      status: status || 'Active',
      categoryId
    });
    
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;