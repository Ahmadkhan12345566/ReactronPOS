import express from 'express';
import { Sale } from '../models/index.js';

const router = express.Router();

// GET /invoices - get all invoices (transformed from sales)
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('customer', 'name email phone image') // Populate customer
      .populate({
        path: 'items',
        populate: {
          path: 'product' // Populate product in each order item
        }
      })
      .sort({ createdAt: 'desc' });

    // Transform sales data to invoice format
    const invoices = sales.map(sale => ({
      id: sale._id, // Mongoose uses _id
      invoiceNo: sale.reference,
      customer: sale.customer ? { // Handle case where customer might be null
        name: sale.customer.name,
        avatar: sale.customer.image
      } : { name: 'N/A', avatar: '' },
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
