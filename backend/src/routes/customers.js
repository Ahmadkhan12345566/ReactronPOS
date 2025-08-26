import express from 'express';
import { models } from '../models/index.js';

const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await models.Customer.findAll({
      where: { status: 'Active' }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new customer
router.post('/', async (req, res) => {
  try {
    const customer = await models.Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;