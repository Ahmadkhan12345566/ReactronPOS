import express from 'express';
import { models } from '../models/index.js';

const router = express.Router();

// Get all billers (users with role 'biller')
router.get('/', async (req, res) => {
  try {
    const billers = await models.User.findAll({
      where: { role: 'biller' },
      attributes: { exclude: ['password'] } // Don't return passwords
    });
    res.json(billers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;