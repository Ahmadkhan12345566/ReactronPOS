// routes/products.js
import express from 'express';
import { models } from '../models/index.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await models.Product.findAll({
      include: [
        { model: models.Category, attributes: ['name'] },
        { model: models.Brand, attributes: ['name'] },
        { model: models.Unit, attributes: ['name'] }
      ]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const product = await models.Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const product = await models.Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await models.Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;