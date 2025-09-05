import express from 'express';
const router = express.Router();
import { models } from '../models/index.js';

router.get('/', async (req, res) => {
  try {
    const brands = await models.Brand.findAll({
      include: [{
        model: models.User,
        as: "User",
        attributes: ['id', 'name']
      }]
    });
    
    // Format the response
    const formattedBrands = brands.map(brand => {
      const brandData = brand.toJSON();
      return {
        ...brandData,
        createdBy: brandData.User ? brandData.User.name : 'Unknown',
        User: undefined
      };
    });
    
    res.json(formattedBrands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, status, image, createdBy } = req.body;
    
    const brand = await models.Brand.create({
      name,
      status: status || 'Active',
      image,
      createdBy
    });
    
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;