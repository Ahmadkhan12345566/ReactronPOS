import express from 'express';
const router = express.Router();
import { models } from '../models/index.js';

router.get('/', async (req, res) => {
  try {
    const units = await models.Unit.findAll({
      include: [{
        model: models.User,
        as: "User",
        attributes: ['id', 'name']
      }]
    });
    
    // Format the response
    const formattedUnits = units.map(unit => {
      const unitData = unit.toJSON();
      return {
        ...unitData,
        createdBy: unitData.User ? unitData.User.name : 'Unknown',
        User: undefined
      };
    });
    
    res.json(formattedUnits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, short_name, status, image, createdBy } = req.body;
    
    const unit = await models.Unit.create({
      name,
      short_name,
      status: status || 'Active',
      createdBy
    });
    
    res.status(201).json(unit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;