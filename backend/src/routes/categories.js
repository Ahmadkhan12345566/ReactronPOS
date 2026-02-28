import express from 'express';
import { Category, User } from '../models/index.js';
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
    const categories = await Category.findAll({
      include: [{ model: User, as: 'createdByUser', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
    
    // Format the response
    const formattedCategories = categories.map(category => {
      const categoryData = toObjectWithId(category);
      const { createdByUser, ...rest } = categoryData;
      return {
        ...rest,
        createdBy: createdByUser ? createdByUser.name : 'Unknown',
      };
    });
    
    res.json(formattedCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, status, image } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required.' });
    }
    
    const category = await Category.create({
      name: name.trim(),
      status: normalizeStatus(status),
      image,
      createdBy: Number(req.user.userId)
    });
    
    res.status(201).json(toObjectWithId(category));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid category id.' });
    }
    const { name, status, image } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    const [updatedCount] = await Category.update(
      {
        name: name.trim(),
        status: normalizeStatus(status),
        image,
      },
      { where: { id: Number(id) } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    const updatedCategory = await Category.findByPk(id);
    res.json(toObjectWithId(updatedCategory));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid category id.' });
    }

    const deletedCount = await Category.destroy({ where: { id: Number(id) } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
