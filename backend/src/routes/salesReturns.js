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

// POST /sales-returns - create a new sales return and update inventory
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { 
      customerId, 
      saleId, 
      date, 
      status, 
      total, 
      paid, 
      due, 
      payment_status, 
      returnItems,
      warehouseId // <-- GET THE WAREHOUSE ID FROM THE REQUEST
    } = req.body;

    if (!warehouseId) {
      throw new Error('Warehouse ID is required for a sales return.');
    }

    // Create the SaleReturn entry
    const salesReturn = await models.SaleReturn.create({
      customerId,
      saleId,
      date: date || new Date(),
      status: status || 'Pending',
      total,
      paid,
      due,
      payment_status: payment_status || 'Unpaid',
      warehouseId // <-- SAVE IT
    }, { transaction });

    // Process each returned item
    if (returnItems && returnItems.length > 0) {
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
          // Pass warehouseId to the helper
          await updateVariantInventory(item.variantId, item.quantity, warehouseId, transaction);
        } else {
          // (This else block for non-variant products is likely flawed, but let's fix the warehouse bug)
          // Pass warehouseId to the helper
          await updateProductInventory(item.productId, item.quantity, warehouseId, transaction);
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
async function updateVariantInventory(variantId, quantity, warehouseId, transaction) {
  const inventory = await models.Inventory.findOne({
    where: { 
      variantId: variantId,
      warehouseId: warehouseId // <-- USE THE PASSED WAREHOUSE ID
    },
    transaction
  });

  if (inventory) {
    await inventory.increment('qty', { by: quantity, transaction });
  } else {
    // Create new inventory record in the correct warehouse
    await models.Inventory.create({
      variantId,
      warehouseId: warehouseId, // <-- USE THE PASSED WAREHOUSE ID
      qty: quantity,
      quantityAlert: 0
    }, { transaction });
  }
}

async function updateProductInventory(productId, quantity, warehouseId, transaction) {
  // Find the first variant for this product (this logic is risky, but consistent with the file)
  const variant = await models.ProductVariant.findOne({
    where: { productId },
    transaction
  });

  if (variant) {
    // Call the other helper with the correct warehouseId
    await updateVariantInventory(variant.id, quantity, warehouseId, transaction);
  } else {
    console.warn(`SalesReturn: Could not find a variant for product ${productId} to restore inventory.`);
  }
}

export default router;