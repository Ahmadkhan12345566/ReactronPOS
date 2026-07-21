import express from 'express';
import Product from '../models/product.js';
import { toObjectWithId } from '../utils/transform.js';
import { isValidId } from '../utils/validation.js';

const router = express.Router();

// Route to lock/unlock a product
router.put('/:id/lock', async (req, res) => {
  try {
    const { lock } = req.body;
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid product id.' });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (lock && product.isLocked) {
      return res.status(409).json({ message: 'Product is currently locked by another user.' });
    }

    product.isLocked = Boolean(lock);
    await product.save();

    res.json(toObjectWithId(product));
  } catch (error) {
    res.status(500).json({ message: 'Server error while locking/unlocking product.', error: error.message });
  }
});

export default router;
