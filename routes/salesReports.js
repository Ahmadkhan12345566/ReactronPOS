import express from 'express';
import { Sale, OrderItem } from '../models/index.js';

const router = express.Router();

// GET /sales-report - get sales report data
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, productId, customerId } = req.query;
    
    // 1. Build a filter for the Sale model
    let saleFilter = {};
    if (startDate && endDate) {
      saleFilter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (customerId) {
      saleFilter.customer = customerId;
    }

    // 2. Find the sales that match the filter to get their IDs
    const sales = await Sale.find(saleFilter).select('_id').lean();
    const saleIds = sales.map(s => s._id);

    // 3. Build a filter for the OrderItem model
    let itemFilter = { sale: { $in: saleIds } };
    if (productId) {
        itemFilter.product = productId;
    }

    // 4. Find and populate all related data for the report
    const orderItems = await OrderItem.find(itemFilter)
      .populate({
          path: 'sale',
          select: 'date' // We only need the sale date for the report
      })
      .populate({
        path: 'product',
        select: 'name image category brand',
        populate: [
            { path: 'category', select: 'name' },
            { path: 'brand', select: 'name' }
        ]
      });

    // 5. Transform the data into the desired report format
    const reportData = orderItems.map(item => ({
      id: `${item.sale._id}-${item._id}`,
      sku: `SO-${item.sale._id}-${item._id}`,
      date: item.sale.date,
      product: {
        name: item.product?.name || 'Unknown Product',
        image: item.product?.image || '',
        brand: item.product?.brand?.name || 'No Brand'
      },
      category: item.product?.category?.name || 'Uncategorized',
      soldQty: item.quantity,
      soldAmount: item.subtotal,
      stockQty: 0 // Placeholder as in original
    }));

    res.json(reportData);
  } catch (error) {
    console.error('GET /sales-report error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
