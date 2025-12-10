import express from 'express';
const router = express.Router();
import { Unit } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/mongoose.js';
import { authenticateToken } from '../middleware/auth.js';

router.get('/', async (req, res) => {
  try {
    const units = await Unit.find().populate('createdBy', 'name');
    
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

import isAdmin from '../middleware/admin.js';
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, short_name, status } = req.body;
    
    const unit = await Unit.create({
      name,
      short_name,
      status: status || 'Active',
      createdBy: req.user.userId
    });
    
    res.status(201).json(toObjectWithId(unit));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
