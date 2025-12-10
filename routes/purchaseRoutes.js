import express from 'express';
import { Purchase, PurchaseItem } from '../models/index.js';

const router = express.Router();

// GET /purchase/report - get purchase report data
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, supplierId } = req.query;
    
    let purchaseWhere = {};
    if (startDate && endDate) {
      purchaseWhere.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (supplierId) {
        purchaseWhere.supplier = supplierId;
    }

    // Find purchase IDs that match the filter
    const purchases = await Purchase.find(purchaseWhere).select('_id').lean();
    const purchaseIds = purchases.map(p => p._id);

    // Find all purchase items linked to the filtered purchases
    const purchaseItems = await PurchaseItem.find({ purchase: { $in: purchaseIds } })
        .populate({
            path: 'purchase',
            populate: { path: 'supplier', select: 'name' }
        })
        .populate({
            path: 'product',
            select: 'name image category',
            populate: { path: 'category', select: 'name' }
        });

    // Transform data into the final report format
    const reportData = purchaseItems.map(item => {
        const purchase = item.purchase;
        const product = item.product;
        return {
            id: `${purchase._id}-${item._id}`,
            reference: purchase.reference,
            sku: `PO-${purchase._id}-${item._id}`,
            dueDate: purchase.date,
            product: {
              name: product?.name || 'Unknown Product',
              image: product?.image || ''
            },
            category: product?.category?.name || 'Uncategorized',
            purchaseQty: item.quantity,
            purchaseAmount: item.subtotal || (item.unitPrice * item.quantity),
            stockQty: 0 // Placeholder, as in original
        }
    });

    res.json(reportData);
  } catch (error) {
    console.error('GET /purchase/report error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
