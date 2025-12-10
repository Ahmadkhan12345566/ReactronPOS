import express from 'express';
import mongoose from 'mongoose';
import { Sale, OrderItem, Inventory, Product, ProductVariant, Customer, User } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/mongoose.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';

const router = express.Router();

// GET /sales - get all sales with related info
router.get('/', authenticateToken, async (req, res) => {
  try {
    const findQuery = {};
    if (req.user.role === 'biller') {
      findQuery.user = req.user.userId;
    }
    const sales = await Sale.find(findQuery)
      .populate('customer', 'name')
      .populate('user', 'name')
      .populate({
        path: 'items',
        populate: [
          { path: 'product', select: 'name' },
          { path: 'variant', select: 'sku attributes' }
        ]
      })
      .sort({ createdAt: 'desc' });

    res.json(toObjectsWithId(sales));
  } catch (error) {
    console.error('GET /sales error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /sales - create a new sale and update inventory
router.post('/', authenticateToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { orderItems, customerId, storeId, ...saleData } = req.body;

    if (!customerId || !storeId || !Array.isArray(orderItems) || orderItems.length === 0) {
      throw new Error('Customer, store, and at least one order item are required.');
    }

    // --- 1. Validate Inventory ---
    for (const item of orderItems) {
      const inventory = await Inventory.findOne({
        variant: item.variantId,
        store: storeId
      }).session(session);

      if (!inventory || inventory.qty < item.quantity) {
        throw new Error(`Insufficient inventory for variant ${item.variantId}. Available: ${inventory?.qty || 0}, Requested: ${item.quantity}`);
      }
    }

    // --- 2. Create OrderItem documents ---
    const createdItems = await OrderItem.create(
      orderItems.map(item => ({
        product: item.productId,
        variant: item.variantId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: item.total, // Assuming 'total' from frontend is item subtotal
      })),
      { session }
    );
    const itemIds = createdItems.map(item => item._id);

    // --- 3. Create Sale ---
    const [sale] = await Sale.create([{
        ...saleData,
        customer: customerId,
        store: storeId,
        items: itemIds,
        user: req.user.userId,
    }], { session });

    // --- 4. Decrement Inventory ---
    for (const item of orderItems) {
      await Inventory.updateOne(
        { variant: item.variantId, store: storeId },
        { $inc: { qty: -item.quantity } },
        { session }
      );
    }
    
    await session.commitTransaction();

    const populatedSale = await Sale.findById(sale._id)
        .populate('customer', 'name')
        .populate('user', 'name')
        .populate({
            path: 'items',
            populate: [{ path: 'product', select: 'name' }, { path: 'variant' }]
        });

    res.status(201).json(toObjectWithId(populatedSale));

  } catch (error) {
    await session.abortTransaction();
    console.error('POST /sales error:', error.stack || error);
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
});

// PUT /sales/:id - This is a complex operation that involves inventory adjustments.
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const saleId = req.params.id;
        const { orderItems, customerId, storeId, ...saleData } = req.body;

        if (!customerId || !storeId || !Array.isArray(orderItems) || orderItems.length === 0) {
            throw new Error('Customer, store, and at least one order item are required.');
        }

        // --- 1. Find the original sale to revert inventory ---
        const originalSale = await Sale.findById(saleId).session(session);
        if (!originalSale) {
            throw new Error('Sale not found');
        }

        // Revert inventory from the original sale items
        const originalOrderItems = await OrderItem.find({ _id: { $in: originalSale.items } }).session(session);
        for (const item of originalOrderItems) {
            await Inventory.updateOne(
                { variant: item.variant, store: originalSale.store },
                { $inc: { qty: item.quantity } },
                { session }
            );
        }

        // --- 2. Validate inventory for the NEW/UPDATED items ---
        for (const item of orderItems) {
            const inventory = await Inventory.findOne({
                variant: item.variantId,
                store: storeId, // Use the new storeId from the request
            }).session(session);

            if (!inventory || inventory.qty < item.quantity) {
                throw new Error(`Insufficient inventory for variant ${item.variantId}. Available: ${inventory?.qty || 0}, Requested: ${item.quantity}`);
            }
        }
        
        // --- 3. Delete old OrderItem documents ---
        await OrderItem.deleteMany({ _id: { $in: originalSale.items } }).session(session);

        // --- 4. Create new OrderItem documents for the updated sale ---
        const updatedItems = await OrderItem.create(
            orderItems.map(item => ({
                product: item.productId,
                variant: item.variantId,
                quantity: item.quantity,
                unit_price: item.unitPrice,
                subtotal: item.total,
            })),
            { session }
        );
        const newItemIds = updatedItems.map(item => item._id);

        // --- 5. Update the Sale document ---
        const updatedSaleData = {
            ...saleData,
            customer: customerId,
            store: storeId,
            items: newItemIds,
            user: req.user.userId,
        };
        const updatedSale = await Sale.findByIdAndUpdate(saleId, updatedSaleData, { new: true, session });

        // --- 6. Decrement inventory for the new items ---
        for (const item of orderItems) {
            await Inventory.updateOne(
                { variant: item.variantId, store: storeId },
                { $inc: { qty: -item.quantity } },
                { session }
            );
        }

        await session.commitTransaction();

        const populatedSale = await Sale.findById(updatedSale._id)
            .populate('customer', 'name')
            .populate('user', 'name')
            .populate({
                path: 'items',
                populate: [{ path: 'product', select: 'name' }, { path: 'variant' }]
            });

        res.status(200).json(toObjectWithId(populatedSale));

    } catch (error) {
        await session.abortTransaction();
        console.error('PUT /sales/:id error:', error.stack || error);
        res.status(500).json({ error: error.message });
    } finally {
        session.endSession();
    }
});

// DELETE /sales/:id - delete a sale and restore inventory
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const sale = await Sale.findById(req.params.id).session(session);
    if (!sale) {
      throw new Error('Sale not found');
    }

    // --- Restore Inventory ---
    const saleItems = await OrderItem.find({ '_id': { $in: sale.items } }).session(session);
    for (const item of saleItems) {
      await Inventory.updateOne(
        { variant: item.variant, store: sale.store },
        { $inc: { qty: item.quantity } },
        { session }
      );
    }

    // --- Delete Sale and its OrderItems ---
    await OrderItem.deleteMany({ '_id': { $in: sale.items } }).session(session);
    await Sale.findByIdAndDelete(req.params.id).session(session);

    await session.commitTransaction();
    res.status(204).send();
  } catch (error) {
    await session.abortTransaction();
    console.error('DELETE /sales/:id error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
});

export default router;
