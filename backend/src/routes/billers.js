import express from 'express';
import { Op } from 'sequelize';
import { User } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/transform.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';
import { isValidId } from '../utils/validation.js';

const router = express.Router();

const escapeLike = (value) => value.replace(/[\\%_]/g, '\\$&');

// Get billers (admins can see all, others only themselves)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = { role: 'biller' };

    if (req.user.role !== 'admin') {
      query.id = Number(req.user.userId);
    }

    const { q, status } = req.query;
    if (status && ['Active', 'Inactive'].includes(status)) {
      query.status = status;
    }

    const where = { ...query };

    if (q && q.trim()) {
      const safe = escapeLike(q.trim());
      where[Op.or] = [
        { name: { [Op.like]: `%${safe}%` } },
        { email: { [Op.like]: `%${safe}%` } },
      ];
    }

    const billers = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    res.json(toObjectsWithId(billers));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid biller id.' });
    }

    const { name, email, role, status } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Biller name is required.' });
    }

    const nextEmail = email ? email.trim() : '';
    if (nextEmail) {
      const existing = await User.findOne({ where: { email: nextEmail, id: { [Op.ne]: Number(id) } } });
      if (existing) {
        return res.status(409).json({ error: 'Email is already in use.' });
      }
    }

    const [updatedCount] = await User.update(
      {
        name: name.trim(),
        email: nextEmail,
        role: ['admin', 'biller'].includes(role) ? role : 'biller',
        status: ['Active', 'Inactive'].includes(status) ? status : 'Active',
      },
      { where: { id: Number(id) } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Biller not found.' });
    }

    const updatedUser = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    res.json(toObjectWithId(updatedUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid biller id.' });
    }

    const deletedCount = await User.destroy({ where: { id: Number(id) } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Biller not found.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
