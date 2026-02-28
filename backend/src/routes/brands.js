import express from 'express';
import { Brand, User } from '../models/index.js';
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
    const brands = await Brand.findAll({
      include: [{ model: User, as: 'createdByUser', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
    
    // Format the response
    const formattedBrands = brands.map(brand => {
      const brandData = toObjectWithId(brand);
      const { createdByUser, ...rest } = brandData;
      return {
        ...rest,
        createdBy: createdByUser ? createdByUser.name : 'Unknown',
      };
    });
    
    res.json(formattedBrands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, status, image } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Brand name is required.' });
    }
    
    const brand = await Brand.create({
      name: name.trim(),
      status: normalizeStatus(status),
      image,
      createdBy: Number(req.user.userId)
    });
    
    res.status(201).json(toObjectWithId(brand));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid brand id.' });
    }
    const { name, status, image } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Brand name is required.' });
    }

    const [updatedCount] = await Brand.update(
      {
        name: name.trim(),
        status: normalizeStatus(status),
        image,
      },
      { where: { id: Number(id) } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Brand not found.' });
    }

    const updatedBrand = await Brand.findByPk(id);
    res.json(toObjectWithId(updatedBrand));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid brand id.' });
    }

    const deletedCount = await Brand.destroy({ where: { id: Number(id) } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Brand not found.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
