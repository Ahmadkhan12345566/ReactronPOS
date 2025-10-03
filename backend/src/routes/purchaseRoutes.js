import express from 'express';
import { models } from '../models/index.js';

const router = express.Router();

// GET /purchase-reports - get purchase report data
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, productId, supplierId } = req.query;
    
    let whereClause = {};
    
    // Add date filter if provided
    if (startDate && endDate) {
      whereClause.date = {
        [models.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    // Get purchase data with related information
    const purchases = await models.Purchase.findAll({
      where: whereClause,
      include: [
        {
          model: models.Supplier,
          attributes: ['id', 'name']
        },
        {
          model: models.PurchaseItem,
          include: [{
            model: models.Product,
            include: [{
              model: models.Category,
              attributes: ['name']
            }],
            attributes: ['id', 'name', 'image'] // Only include fields that exist
          }]
        }
      ],
      order: [['date', 'DESC']]
    });

    // Transform data into report format
    const reportData = purchases.flatMap(purchase => 
      purchase.PurchaseItems.map(item => ({
        id: `${purchase.id}-${item.id}`,
        reference: purchase.reference,
        sku: `PO-${purchase.id}-${item.id}`, // Generate a reference-based SKU
        dueDate: purchase.date,
        product: {
          name: item.Product?.name || 'Unknown Product',
          image: item.Product?.image || ''
        },
        category: item.Product?.Category?.name || 'Uncategorized', // Get category from association
        purchaseQty: item.quantity,
        purchaseAmount: item.subtotal || (item.unitPrice * item.quantity), // Calculate if subtotal doesn't exist
        stockQty: 0 // Placeholder - you'll need to implement inventory lookup
      }))
    );

    res.json(reportData);
  } catch (error) {
    console.error('GET /purchase-reports error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;