import express from 'express';
import { Sale, Customer } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /invoices - get all invoices (transformed from sales)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [{ model: Customer, as: 'customer', attributes: ['id', 'name', 'email', 'phone', 'image'] }],
      order: [['createdAt', 'DESC']],
    });

    const invoices = sales.map(sale => ({
      id: sale.id,
      invoiceNo: sale.reference,
      customer: sale.customer ? {
        id: sale.customer.id,
        name: sale.customer.name,
        avatar: sale.customer.image
      } : { id: null, name: 'N/A', avatar: '' },
      dueDate: sale.date ? new Date(sale.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) : null,
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
