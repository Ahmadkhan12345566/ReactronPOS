import express from 'express';
const router = express.Router();
import { Brand } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/mongoose.js';
import { authenticateToken } from '../middleware/auth.js';

router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find().populate('createdBy', 'name');
    
    // Format the response
    const formattedBrands = brands.map(brand => {
      const brandData = toObjectWithId(brand);
      return {
        ...brandData,
        createdBy: brand.createdBy ? brand.createdBy.name : 'Unknown',
      };
    });
    
    res.json(formattedBrands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

import isAdmin from '../middleware/admin.js';
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, status, image } = req.body;
    
    const brand = await Brand.create({
      name,
      status: status || 'Active',
      image,
      createdBy: req.user.userId
    });
    
    res.status(201).json(toObjectWithId(brand));
  } catch (error)
 {
    res.status(500).json({ error: error.message });
  }
});

export default router;
