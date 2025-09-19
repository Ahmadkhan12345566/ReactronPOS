import express from 'express';
import { models } from '../models/index.js';

const router = express.Router();

// GET /invoices - get all invoices (transformed from sales)
router.get('/', async (req, res) => {
  try {
    const sales = await models.Sale.findAll({
      include: [
        { 
          model: models.Customer,
          attributes: ['id', 'name', 'email', 'phone', 'image']
        },
        {
          model: models.OrderItem,
          include: [models.Product]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Transform sales data to invoice format
    const invoices = sales.map(sale => ({
      id: sale.id,
      invoiceNo: sale.reference,
      customer: {
        name: sale.Customer.name,
        avatar: sale.Customer.image
      },
      dueDate: new Date(sale.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      amount: sale.total,
      paid: sale.paid,
      amountDue: sale.due,
      status: sale.payment_status
    }));

    res.json(invoices);
  } catch (error) {
    console.error('GET /invoices error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;