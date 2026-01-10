import express from 'express';
import mongoose from 'mongoose';
import { Brand } from '../models/index.js';
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
    const brands = await Brand.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
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

router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, status, image } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Brand name is required.' });
    }
    
    const brand = await Brand.create({
      name: name.trim(),
      status: normalizeStatus(status),
      image,
      createdBy: req.user.userId
    });
    
    res.status(201).json(toObjectWithId(brand));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid brand id.' });
    }
    const { name, status, image } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Brand name is required.' });
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        status: normalizeStatus(status),
        image,
      },
      { new: true }
    );

    if (!updatedBrand) {
      return res.status(404).json({ error: 'Brand not found.' });
    }

    res.json(toObjectWithId(updatedBrand));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid brand id.' });
    }

    const deletedBrand = await Brand.findByIdAndDelete(id);
    if (!deletedBrand) {
      return res.status(404).json({ error: 'Brand not found.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
