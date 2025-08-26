// Update sales route to work with associations
import express from 'express';
import { models } from '../models/index.js';
import { ConcurrencyControlService } from '../services/concurrencycontrol.js';

const router = express.Router();

// Create a new sale
router.post('/', async (req, res) => {
  const transaction = await models.sequelize.transaction();
  
  try {
    const { customerId, userId, items, subtotal, discount, tax, total, paymentMethod, amountTendered, change } = req.body;

    // Create sale record
    const sale = await models.Sale.create({
      customerId: customerId || null,
      userId: userId || null,
      reference: await ConcurrencyControlService.generateReference('SL'),
      date: new Date(),
      status: 'Completed',
      payment_status: 'Paid',
      payment_method: paymentMethod,
      subtotal,
      discount,
      tax,
      total,
      paid: amountTendered,
      due: 0
    }, { transaction });

    // Create sale items and update inventory
    for (const item of items) {
      // Create sale item
      await models.OrderItem.create({
        saleId: sale.id,
        productId: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        discount: item.discount || 0,
        subtotal: item.subtotal
      }, { transaction });

      // Update product inventory using the association
      const product = await models.Product.findByPk(item.productId, { transaction });
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.qty < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.qty}, Requested: ${item.quantity}`);
      }

      await product.update({
        qty: product.qty - item.quantity
      }, { transaction });
    }

    await transaction.commit();
    
    // Return sale with populated associations
    const populatedSale = await models.Sale.findByPk(sale.id, {
      include: [
        { model: models.Customer },
        { model: models.User, as: 'biller' },
        { 
          model: models.OrderItem,
          include: [models.Product]
        }
      ]
    });
    
    res.status(201).json(populatedSale);
  } catch (error) {
    await transaction.rollback();
    console.error('Sale creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all sales with associations
router.get('/', async (req, res) => {
  try {
    const sales = await models.Sale.findAll({
      include: [
        { model: models.Customer },
        { model: models.User, as: 'biller' },
        { 
          model: models.OrderItem,
          include: [models.Product]
        }
      ],
      order: [['date', 'DESC']]
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;