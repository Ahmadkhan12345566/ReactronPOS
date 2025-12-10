import express from 'express';
import { Customer } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/mongoose.js';
import { authenticateToken } from '../middleware/auth.js';


const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find({ status: 'Active' });
    res.json(toObjectsWithId(customers));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new customer
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address, city, country, image, status } = req.body;
    
    const customer = await Customer.create({
      name,
      email,
      phone,
      address,
      city,
      country,
      image,
      status: status || 'Active',
      createdBy: req.user.userId,
    });
    
    res.status(201).json(toObjectWithId(customer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
