import express from 'express';
import mongoose from 'mongoose';
import { Purchase, PurchaseItem, Inventory, Supplier, Product } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/mongoose.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';

const router = express.Router();

// Get all purchases with supplier and item information
router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('supplier', 'name email phone')
      .populate({
        path: 'items',
        populate: {
          path: 'product',
          select: 'name'
        }
      })
      .sort({ date: 'desc' });
    res.json(toObjectsWithId(purchases));
  } catch (error) {
    console.error('GET /purchases error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new purchase with inventory updates
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { reference, date, status, payment_status, total, paid, due, supplierId, purchaseItems } = req.body;
    
    // 1. Create Purchase (without items initially)
    const purchaseData = {
      reference,
      date: date || new Date(),
      status,
      payment_status,
      total: parseFloat(total) || 0,
      paid: parseFloat(paid) || 0,
      due: parseFloat(due) || 0,
      supplier: supplierId,
      items: [],
      createdBy: req.user.userId,
    };
    const [purchase] = await Purchase.create([purchaseData], { session });

    // 2. Create purchase items and update inventory
    const itemIds = [];
    if (Array.isArray(purchaseItems) && purchaseItems.length > 0) {
      for (const item of purchaseItems) {
        const [newPurchaseItem] = await PurchaseItem.create([{
          purchase: purchase._id,
          product: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal
        }], { session });
        itemIds.push(newPurchaseItem._id);

        // Update inventory using findOneAndUpdate with upsert
        if (item.variantId && item.storeId) {
          await Inventory.findOneAndUpdate(
            { variant: item.variantId, store: item.storeId },
            { $inc: { qty: item.quantity } },
            { upsert: true, new: true, session }
          );
        }
      }
    }

    // 3. Add item IDs to the purchase
    purchase.items = itemIds;
    await purchase.save({ session });

    await session.commitTransaction();

    // 4. Fetch and return the fully populated purchase
    const createdPurchase = await Purchase.findById(purchase._id)
      .populate('supplier', 'name email phone')
      .populate({
        path: 'items',
        populate: { path: 'product', select: 'name' }
      });

    res.status(201).json(toObjectWithId(createdPurchase));
  } catch (error) {
    await session.abortTransaction();
    console.error('POST /purchases error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
});

export default router;
