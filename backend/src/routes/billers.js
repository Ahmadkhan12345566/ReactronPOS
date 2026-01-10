import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/mongoose.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';

const router = express.Router();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Get billers (admins can see all, others only themselves)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = { role: 'biller' };

    if (req.user.role !== 'admin') {
      query._id = req.user.userId;
    }

    const { q, status } = req.query;
    if (status && ['Active', 'Inactive'].includes(status)) {
      query.status = status;
    }

    if (q && q.trim()) {
      const safe = escapeRegex(q.trim());
      query.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { email: { $regex: safe, $options: 'i' } },
      ];
    }
                 
    const billers = await User.find(query, '-password').sort({ createdAt: -1 });
    res.json(toObjectsWithId(billers));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid biller id.' });
    }

    const { name, email, role, status } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Biller name is required.' });
    }

    const nextEmail = email ? email.trim() : '';
    if (nextEmail) {
      const existing = await User.findOne({ email: nextEmail, _id: { $ne: id } });
      if (existing) {
        return res.status(409).json({ error: 'Email is already in use.' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        email: nextEmail,
        role: ['admin', 'biller'].includes(role) ? role : 'biller',
        status: ['Active', 'Inactive'].includes(status) ? status : 'Active',
      },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Biller not found.' });
    }

    res.json(toObjectWithId(updatedUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid biller id.' });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'Biller not found.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
