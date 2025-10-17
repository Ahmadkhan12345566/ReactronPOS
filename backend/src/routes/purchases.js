import express from 'express';
import { models } from '../models/index.js';

const router = express.Router();

// Get all purchases with supplier information
router.get('/', async (req, res) => {
  try {
    const purchases = await models.Purchase.findAll({
      include: [
        {
          model: models.Supplier,
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: models.PurchaseItem,
          include: [
            {
              model: models.Product,
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new purchase with inventory updates
router.post('/', async (req, res) => {
  const transaction = await models.sequelize.transaction();
  
  try {
    const { reference, date, status, payment_status, total, paid, due, supplierId, purchaseItems } = req.body;
    
    // Create purchase
    const purchase = await models.Purchase.create({
      reference,
      date: date || new Date(),
      status,
      payment_status,
      total: parseFloat(total) || 0,
      paid: parseFloat(paid) || 0,
      due: parseFloat(due) || 0,
      supplierId: parseInt(supplierId)
    }, { transaction });

    // Create purchase items and update inventory
    if (Array.isArray(purchaseItems) && purchaseItems.length > 0) {
      for (const item of purchaseItems) {
        // Create purchase item
        await models.PurchaseItem.create({
          purchaseId: purchase.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal
        }, { transaction });

        // Update inventory
        if (item.variantId && item.warehouseId) {
          // Check if inventory record exists
          let inventory = await models.Inventory.findOne({
            where: { 
              variantId: item.variantId,
              warehouseId: item.warehouseId
            },
            transaction
          });

          if (inventory) {
            // Update existing inventory
            await inventory.increment('qty', { 
              by: item.quantity,
              transaction
            });
          } else {
            // Create new inventory record
            await models.Inventory.create({
              variantId: item.variantId,
              warehouseId: item.warehouseId,
              qty: item.quantity,
              quantityAlert: 0
            }, { transaction });
          }
        }
      }
    }

    await transaction.commit();

    // Return created purchase with related data
    const createdPurchase = await models.Purchase.findByPk(purchase.id, {
      include: [
        {
          model: models.Supplier,
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: models.PurchaseItem,
          include: [
            {
              model: models.Product,
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    res.status(201).json(createdPurchase);
  } catch (error) {
    await transaction.rollback();
    console.error('POST /purchases error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;