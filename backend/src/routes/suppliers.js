import express from 'express';
import { Supplier, User } from '../models/index.js';
import { toObjectWithId } from '../utils/transform.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';
import { isValidId } from '../utils/validation.js';

const router = express.Router();

const normalizeStatus = (status) => {
  if (!status) return 'Active';
  return ['Active', 'Inactive'].includes(status) ? status : 'Active';
};

// Get suppliers (admins see all, others only active)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { status: 'Active' };
    const suppliers = await Supplier.findAll({
      where: query,
      include: [{ model: User, as: 'createdByUser', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });

    const formattedSuppliers = suppliers.map((supplier) => {
      const supplierData = toObjectWithId(supplier);
      const { createdByUser, ...rest } = supplierData;
      return {
        ...rest,
        createdBy: createdByUser ? createdByUser.name : 'Unknown',
      };
    });

    res.json(formattedSuppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new supplier
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, phone, address, image, status } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Supplier name is required.' });
    }
    const supplier = await Supplier.create({
      name: name.trim(),
      email: email ? email.trim() : '',
      phone: phone ? phone.trim() : '',
      address: address ? address.trim() : '',
      image,
      status: normalizeStatus(status),
      createdBy: Number(req.user.userId),
    });
    
    res.status(201).json(toObjectWithId(supplier));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid supplier id.' });
    }
    const { name, email, phone, address, image, status } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Supplier name is required.' });
    }

    const [updatedCount] = await Supplier.update(
      {
        name: name.trim(),
        email: email ? email.trim() : '',
        phone: phone ? phone.trim() : '',
        address: address ? address.trim() : '',
        image,
        status: normalizeStatus(status),
      },
      { where: { id: Number(id) } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Supplier not found.' });
    }

    const updatedSupplier = await Supplier.findByPk(id);
    res.json(toObjectWithId(updatedSupplier));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid supplier id.' });
    }

    const deletedCount = await Supplier.destroy({ where: { id: Number(id) } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Supplier not found.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
