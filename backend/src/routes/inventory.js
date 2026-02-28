import express from 'express';
import { Inventory } from '../models/index.js';
import { toObjectWithId } from '../utils/transform.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';
import { isValidId } from '../utils/validation.js';

const router = express.Router();

// Create a new inventory entry
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { variantId, storeId, qty, quantityAlert } = req.body;
    if (!isValidId(variantId) || !isValidId(storeId)) {
      return res.status(400).json({ error: 'Valid variantId and storeId are required.' });
    }

    const [inventory, created] = await Inventory.findOrCreate({
      where: { variantId: Number(variantId), storeId: Number(storeId) },
      defaults: {
        qty: Number(qty) || 0,
        quantityAlert: Number(quantityAlert) || 0,
      },
    });

    if (!created) {
      await inventory.update({
        qty: Number(qty) || 0,
        quantityAlert: Number(quantityAlert) || 0,
      });
    }
    res.status(201).json(toObjectWithId(inventory));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
