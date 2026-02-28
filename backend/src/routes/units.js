import express from 'express';
import { Unit, User } from '../models/index.js';
import { toObjectWithId } from '../utils/transform.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';
import { isValidId } from '../utils/validation.js';

const router = express.Router();

const normalizeStatus = (status) => {
  if (!status) return 'Active';
  return ['Active', 'Inactive'].includes(status) ? status : 'Active';
};

router.get('/', authenticateToken, async (req, res) => {
  try {
    const units = await Unit.findAll({
      include: [{ model: User, as: 'createdByUser', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
    
    // Format the response to have createdBy as a string
    const formattedUnits = units.map(unit => {
      const unitData = toObjectWithId(unit);
      const { createdByUser, ...rest } = unitData;
      return {
        ...rest,
        createdBy: createdByUser ? createdByUser.name : 'Unknown',
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
      createdBy: Number(req.user.userId)
    });
    
    res.status(201).json(toObjectWithId(unit));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid unit id.' });
    }
    const { name, short_name, status } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Unit name is required.' });
    }

    const [updatedCount] = await Unit.update(
      {
        name: name.trim(),
        short_name: short_name ? short_name.trim() : '',
        status: normalizeStatus(status),
      },
      { where: { id: Number(id) } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Unit not found.' });
    }

    const updatedUnit = await Unit.findByPk(id);
    res.json(toObjectWithId(updatedUnit));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid unit id.' });
    }

    const deletedCount = await Unit.destroy({ where: { id: Number(id) } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Unit not found.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
