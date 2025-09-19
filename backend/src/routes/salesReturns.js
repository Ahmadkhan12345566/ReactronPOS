import express from 'express';
import { models } from '../models/index.js';
import { sequelize } from '../models/index.js';

const router = express.Router();

// GET /sales-returns - get all sales returns with customer and product info
router.get('/', async (req, res) => {
  try {
    const salesReturns = await models.SaleReturn.findAll({
      include: [
        { 
          model: models.Customer,
          attributes: ['id', 'name', 'email', 'phone', 'image']
        },
        {
          model: models.ReturnItem,
          include: [models.Product]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Transform data to match frontend expectations
    const transformedReturns = salesReturns.map(returnItem => {
      const firstProduct = returnItem.ReturnItems[0]?.Product;
      
      return {
        id: returnItem.id,
        date: returnItem.date,
        status: returnItem.status,
        total: returnItem.total,
        paid: returnItem.paid,
        due: returnItem.due,
        paymentStatus: returnItem.payment_status,
        customer: {
          id: returnItem.Customer.id,
          name: returnItem.Customer.name,
          email: returnItem.Customer.email,
          phone: returnItem.Customer.phone,
          avatar: returnItem.Customer.image
        },
        product: firstProduct ? {
          id: firstProduct.id,
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

// POST /sales-returns - create a new sales return
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { date, status, total, paid, due, paymentStatus, customerId, saleId, returnItems } = req.body;

    // Create sales return
    const salesReturn = await models.SaleReturn.create({
      date: date || new Date(),
      status: status || 'Pending',
      total: total || 0,
      paid: paid || 0,
      due: due || 0,
      payment_status: paymentStatus || 'Unpaid',
      customerId,
      saleId
    }, { transaction });

    // Create return items
    if (Array.isArray(returnItems) && returnItems.length > 0) {
      for (const item of returnItems) {
        await models.ReturnItem.create({
          returnId: salesReturn.id,
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total
        }, { transaction });

        // Update inventory (add back returned items)
        if (item.variantId) {
          await updateVariantInventory(item.variantId, item.quantity, transaction);
        } else {
          await updateProductInventory(item.productId, item.quantity, transaction);
        }
      }
    }

    await transaction.commit();
    res.status(201).json(salesReturn);
  } catch (error) {
    await transaction.rollback();
    console.error('POST /sales-returns error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper functions for inventory updates
async function updateVariantInventory(variantId, quantity, transaction) {
  const inventory = await models.Inventory.findOne({
    where: { variantId },
    transaction
  });

  if (inventory) {
    await inventory.increment('qty', { by: quantity, transaction });
  } else {
    await models.Inventory.create({
      variantId,
      warehouseId: 1,
      qty: quantity,
      quantityAlert: 0
    }, { transaction });
  }
}

async function updateProductInventory(productId, quantity, transaction) {
  const variant = await models.ProductVariant.findOne({
    where: { productId },
    transaction
  });

  if (variant) {
    await updateVariantInventory(variant.id, quantity, transaction);
  }
}

export default router;