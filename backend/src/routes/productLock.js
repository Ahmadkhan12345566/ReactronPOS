import express from 'express';
import Product from '../models/product.js';

const router = express.Router();

// Route to lock/unlock a product
router.put('/:id/lock', async (req, res) => {
    try {
        const { lock } = req.body; // Expecting { lock: true } or { lock: false }
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // If trying to lock a product that is already locked by someone else
        // This check is simple. For real pessimistic locking, you might also store who locked it.
        if (lock && product.locked) {
            return res.status(409).json({ message: 'Product is currently locked by another user.' });
        }

        product.locked = lock;
        await product.save();

        res.json(product); // Return the updated product
    } catch (error) {
        res.status(500).json({ message: 'Server error while locking/unlocking product.', error: error.message });
    }
});

export default router;
