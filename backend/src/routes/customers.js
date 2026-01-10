import express from 'express';
import mongoose from 'mongoose';
import { Customer } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/mongoose.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';

const router = express.Router();

const normalizeStatus = (status) => {
  if (!status) return 'Active';
  return ['Active', 'Inactive'].includes(status) ? status : 'Active';
};

// Get customers (admins see all, others only active)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { status: 'Active' };
    const customers = await Customer.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    const formattedCustomers = customers.map((customer) => {
      const customerData = toObjectWithId(customer);
      return {
        ...customerData,
        createdBy: customer.createdBy ? customer.createdBy.name : 'Unknown',
      };
    });

    res.json(formattedCustomers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new customer
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address, city, country, image, status } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Customer name is required.' });
    }
    
    const customer = await Customer.create({
      name: name.trim(),
      email: email ? email.trim() : '',
      phone: phone ? phone.trim() : '',
      address: address ? address.trim() : '',
      city: city ? city.trim() : '',
      country: country ? country.trim() : '',
      image,
      status: normalizeStatus(status),
      createdBy: req.user.userId,
    });
    
    res.status(201).json(toObjectWithId(customer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid customer id.' });
    }
    const { name, email, phone, address, city, country, image, status } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Customer name is required.' });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        email: email ? email.trim() : '',
        phone: phone ? phone.trim() : '',
        address: address ? address.trim() : '',
        city: city ? city.trim() : '',
        country: country ? country.trim() : '',
        image,
        status: normalizeStatus(status),
      },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    res.json(toObjectWithId(updatedCustomer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid customer id.' });
    }

    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
