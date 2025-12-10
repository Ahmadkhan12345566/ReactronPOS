import express from 'express';
import mongoose from 'mongoose';
import { toObjectWithId } from '../utils/mongoose.js';
import { SaleReturn, ReturnItem, Inventory, Customer, Product, ProductVariant } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';

const router = express.Router();

// Mongoose-based helper for inventory updates
const updateInventoryOnReturn = async (variantId, productId, quantity, storeId, session) => {
  let finalVariantId = variantId;

  // If no variantId, find the first variant for the product (maintaining original risky logic)
  if (!finalVariantId && productId) {
    const variant = await ProductVariant.findOne({ product: productId }).session(session).lean();
    if (variant) {
      finalVariantId = variant._id;
    } else {
      console.warn(`SalesReturn: Could not find a variant for product ${productId} to restore inventory.`);
      return; // Can't update inventory without a variant
    }
  }

  if (finalVariantId && storeId) {
    // Use findOneAndUpdate with upsert to either create or update the inventory record
    await Inventory.findOneAndUpdate(
      { variant: finalVariantId, store: storeId },
      { $inc: { qty: quantity } }, // Add items back to inventory
      { upsert: true, new: true, session }
    );
  }
};


// GET /sales-returns - get all sales returns
router.get('/', async (req, res) => {
  try {
    const salesReturns = await SaleReturn.find()
      .populate('customer', 'name email phone image')
      .populate({
        path: 'items',
        populate: {
          path: 'product',
          select: 'name image'
        }
      })
      .sort({ createdAt: 'desc' });

    // Transform data to match frontend expectations
    const transformedReturns = salesReturns.map(returnDoc => {
      const firstItem = returnDoc.items && returnDoc.items[0];
      const firstProduct = firstItem ? firstItem.product : null;
      
      return {
        id: returnDoc._id,
        date: returnDoc.date,
        status: returnDoc.status,
        total: returnDoc.total,
        paid: returnDoc.paid,
        due: returnDoc.due,
        paymentStatus: returnDoc.payment_status,
        customer: returnDoc.customer ? {
          id: returnDoc.customer._id,
          name: returnDoc.customer.name,
          email: returnDoc.customer.email,
          phone: returnDoc.customer.phone,
          avatar: returnDoc.customer.image
        } : null,
        product: firstProduct ? {
          id: firstProduct._id,
          name: firstProduct.name,
          image: firstProduct.image
        } : null
      };
    });

    res.json(transformedReturns);
  } catch (error) {
    console.error('GET /sales-returns error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /sales-returns - create a new sales return and update inventory
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { returnItems, storeId, customerId, ...saleReturnData } = req.body;

    if (!storeId || !customerId || !Array.isArray(returnItems) || returnItems.length === 0) {
      throw new Error('Store, customer, and at least one return item are required.');
    }

    // 1. Create ReturnItem documents
    const createdItems = await ReturnItem.create(
        returnItems.map(item => ({
            product: item.productId,
            variant: item.variantId || null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            reason: item.reason || '',
            subtotal: item.total
        })), { session }
    );
    const itemIds = createdItems.map(item => item._id);

    // 2. Create the SaleReturn
    const [salesReturn] = await SaleReturn.create([{
      ...saleReturnData,
      customer: customerId,
      store: storeId,
      items: itemIds,
      createdBy: req.user.userId,
    }], { session });

    // 3. Update inventory for each returned item
    for (const item of returnItems) {
      await updateInventoryOnReturn(item.variantId, item.productId, item.quantity, storeId, session);
    }

    await session.commitTransaction();
    res.status(201).json(toObjectWithId(salesReturn));
  } catch (error) {
    await session.abortTransaction();
    console.error('POST /sales-returns error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
});

export default router;
