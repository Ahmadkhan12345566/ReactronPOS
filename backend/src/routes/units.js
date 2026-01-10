import express from 'express';
import mongoose from 'mongoose';
import { Unit } from '../models/index.js';
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
    const units = await Unit.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    // Format the response to have createdBy as a string
    const formattedUnits = units.map(unit => {
      const unitData = toObjectWithId(unit);
      return {
        ...unitData,
        createdBy: unit.createdBy ? unit.createdBy.name : 'Unknown',
      };
    });
    
    res.json(formattedUnits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, short_name, status } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Unit name is required.' });
    }
    
    const unit = await Unit.create({
      name: name.trim(),
      short_name: short_name ? short_name.trim() : '',
      status: normalizeStatus(status),
      createdBy: req.user.userId
    });
    
    res.status(201).json(toObjectWithId(unit));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid unit id.' });
    }
    const { name, short_name, status } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Unit name is required.' });
    }

    const updatedUnit = await Unit.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        short_name: short_name ? short_name.trim() : '',
        status: normalizeStatus(status),
      },
      { new: true }
    );

    if (!updatedUnit) {
      return res.status(404).json({ error: 'Unit not found.' });
    }

    res.json(toObjectWithId(updatedUnit));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid unit id.' });
    }

    const deletedUnit = await Unit.findByIdAndDelete(id);
    if (!deletedUnit) {
      return res.status(404).json({ error: 'Unit not found.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
