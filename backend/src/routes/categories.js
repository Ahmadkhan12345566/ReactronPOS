import express from 'express';
const router = express.Router();
import { models } from '../models/index.js';

router.get('/', async (req, res) => {
  try {
    const categories = await models.Category.findAll({
      include: [{
        model: models.User,
        as: "User",
        attributes: ['id', 'name']
      }]
    });
    console.log('Raw categories data:', JSON.stringify(categories, null, 2));
    // Format the response
    const formattedCategories = categories.map(category => {
      const categoryData = category.toJSON();
      return {
        ...categoryData,
        createdBy: categoryData.User ? categoryData.User.name : 'Unknown',
        // Remove the nested User object to avoid confusion
        User: undefined
      };
    });
    
    res.json(formattedCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, status, image, createdBy } = req.body;
    
    const category = await models.Category.create({
      name,
      status: status || 'Active',
      image,
      createdBy
    });
    
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
