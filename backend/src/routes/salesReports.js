import express from 'express';
import { models } from '../models/index.js';

const router = express.Router();

// GET /sales-report - get sales report data
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, productId, customerId } = req.query;
    
    let whereClause = {};
    
    // Add date filter if provided
    if (startDate && endDate) {
      whereClause.date = {
        [models.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    // Get sales data with related information
    const sales = await models.Sale.findAll({
      where: whereClause,
      include: [
        {
          model: models.Customer,
          attributes: ['id', 'name']
        },
        {
          model: models.OrderItem,
          include: [{
            model: models.Product,
            attributes: ['id', 'name', 'image', 'sku', 'category'] // Removed 'brand' as it doesn't exist
          }]
        }
      ],
      order: [['date', 'DESC']]
    });

    // Transform data into report format
    const reportData = sales.flatMap(sale => 
      sale.OrderItems.map(item => ({
        id: `${sale.id}-${item.id}`,
        sku: item.Product?.sku || 'N/A',
        date: sale.date,
        product: {
          name: item.Product?.name || 'Unknown Product',
          image: item.Product?.image || '',
          brand: item.Product?.brand || 'No Brand' // Provide default value
        },
        category: item.Product?.category || 'Uncategorized',
        soldQty: item.quantity,
        soldAmount: item.total,
        stockQty: 0 // Placeholder - you'll need to implement inventory lookup
      }))
    );

    res.json(reportData);
  } catch (error) {
    console.error('GET /sales-report error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;