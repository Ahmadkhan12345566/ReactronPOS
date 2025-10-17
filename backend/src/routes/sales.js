import express from 'express';
import { models } from '../models/index.js';
import { sequelize } from '../models/index.js';

const router = express.Router();

// GET /sales - get all sales with customer and user info
router.get('/', async (req, res) => {
  try {
    const sales = await models.Sale.findAll({
      include: [
        { model: models.Customer, attributes: ['name'] },
        { model: models.User, attributes: ['name'] },
        { 
          model: models.OrderItem, 
          include: [
            models.Product,
            models.ProductVariant
          ] 
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(sales);
  } catch (error) {
    console.error('GET /sales error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();
  let committed = false;

  try {
    const {
      reference,
      date,
      status,
      payment_status,
      payment_method,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      paid,
      due,
      note,
      customerId,
      userId,
      orderItems
    } = req.body;

    if (!reference || !customerId) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Reference and customer are required' });
    }

    // Validate inventory before creating sale
    if (Array.isArray(orderItems) && orderItems.length > 0) {
      for (const item of orderItems) {
        if (!item.variantId) {
          await transaction.rollback();
          return res.status(400).json({ 
            error: `Variant ID is required for product ${item.productId}. Each product must have a specific variant selected.` 
          });
        }

        const variant = await models.ProductVariant.findByPk(item.variantId, {
          include: [{
            model: models.Inventory,
            required: false
          }],
          transaction
        });

        if (!variant) {
          await transaction.rollback();
          return res.status(400).json({ 
            error: `Variant ${item.variantId} not found` 
          });
        }

        let availableQty = 0;
        if (variant.Inventories && variant.Inventories.length > 0) {
          variant.Inventories.forEach(inventory => {
            availableQty += parseInt(inventory.qty || 0);
          });
        }

        if (availableQty < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({ 
            error: `Insufficient inventory for variant ${item.variantId}. Available: ${availableQty}, Requested: ${item.quantity}` 
          });
        }
      }
    }

    const sale = await models.Sale.create({
      reference,
      date: date || new Date(),
      status: status || 'Pending',
      payment_status: payment_status || 'Unpaid',
      payment_method: payment_method || '',
      subtotal: subtotal || 0,
      discount: discount || 0,
      tax: tax || 0,
      shipping: shipping || 0,
      total: total || 0,
      paid: paid || 0,
      due: due || 0,
      note: note || '',
      customerId,
      userId
    }, { transaction });

    if (Array.isArray(orderItems) && orderItems.length > 0) {
      for (const item of orderItems) {
        await models.OrderItem.create({
          saleId: sale.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total
        }, { transaction });

        if (item.variantId) {
          const inventory = await models.Inventory.findOne({
            where: { 
              variantId: item.variantId,
              warehouseId: req.body.warehouseId
            },
            transaction
          });

          if (inventory) {
            await inventory.decrement('qty', { 
              by: item.quantity,
              transaction
            });
          } else {
            await models.Inventory.create({
              variantId: item.variantId,
              warehouseId: req.body.warehouseId,
              qty: -item.quantity,
              quantityAlert: 0
            }, { transaction });
          }
        }
      }
    }

    await transaction.commit();
    committed = true; // ✅ Only commit once

    const createdSale = await models.Sale.findByPk(sale.id, {
      include: [
        { model: models.Customer, attributes: ['name'] },
        { model: models.User, attributes: ['name'] },
        { 
          model: models.OrderItem, 
          include: [
            models.Product,
            models.ProductVariant
          ] 
        }
      ]
    });

    res.status(201).json(createdSale);

  } catch (error) {
    if (!committed) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError.message);
      }
    }

    console.error('POST /sales error:', error.stack || error);
    res.status(500).json({ error: error.message });
  }
});


// PUT /sales/:id - update sale
router.put('/:id', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const sale = await models.Sale.findByPk(req.params.id);
    if (!sale) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Sale not found' });
    }

    await sale.update(req.body, { transaction });

    // Update order items if provided
    if (Array.isArray(req.body.orderItems)) {
      // First remove existing order items
      await models.OrderItem.destroy({ 
        where: { saleId: sale.id },
        transaction
      });

      // Then create new ones with inventory validation
      for (const item of req.body.orderItems) {
        if (!item.variantId) {
          await transaction.rollback();
          return res.status(400).json({ 
            error: 'Variant ID is required for all order items' 
          });
        }

        // Validate inventory for the new items
        const variant = await models.ProductVariant.findByPk(item.variantId, {
          include: [models.Inventory],
          transaction
        });

        if (!variant) {
          await transaction.rollback();
          return res.status(400).json({ error: `Variant ${item.variantId} not found` });
        }

        let availableQty = 0;
        if (variant.Inventories && variant.Inventories.length > 0) {
          variant.Inventories.forEach(inv => {
            availableQty += parseInt(inv.qty || 0);
          });
        }

        if (availableQty < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({ 
            error: `Insufficient inventory for variant ${item.variantId}` 
          });
        }

        // Create order item
        await models.OrderItem.create({
          saleId: sale.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity || 0,
          unitPrice: item.unitPrice || 0,
          total: item.total || 0
        }, { transaction });

        // Update inventory
        const inventories = await models.Inventory.findAll({
          where: { variantId: item.variantId },
          order: [['qty', 'DESC']],
          transaction
        });

        let remainingQty = item.quantity;
        for (const inventory of inventories) {
          if (remainingQty <= 0) break;
          const deductQty = Math.min(remainingQty, inventory.qty);
          await inventory.decrement('qty', { by: deductQty, transaction });
          remainingQty -= deductQty;
        }
      }
    }

    await transaction.commit();

    const updatedSale = await models.Sale.findByPk(sale.id, {
      include: [
        { model: models.Customer, attributes: ['name'] },
        { model: models.User, attributes: ['name'] },
        { 
          model: models.OrderItem, 
          include: [
            models.Product,
            models.ProductVariant
          ] 
        }
      ]
    });

    res.json(updatedSale);
  } catch (error) {
    await transaction.rollback();
    console.error('PUT /sales/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /sales/:id
router.delete('/:id', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const sale = await models.Sale.findByPk(req.params.id);
    if (!sale) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Sale not found' });
    }

    // Get order items before deletion to restore inventory
    const orderItems = await models.OrderItem.findAll({
      where: { saleId: sale.id },
      transaction
    });

    // Restore inventory for each order item
    for (const item of orderItems) {
      if (item.variantId) {
        const inventory = await models.Inventory.findOne({
          where: { 
            variantId: item.variantId,
            warehouseId: 1 // Default warehouse for restoration
          },
          transaction
        });

        if (inventory) {
          await inventory.increment('qty', { 
            by: item.quantity,
            transaction
          });
        } else {
          // Create inventory record if it doesn't exist
          await models.Inventory.create({
            variantId: item.variantId,
            warehouseId: 1,
            qty: item.quantity,
            quantityAlert: 0
          }, { transaction });
        }
      }
    }

    // Delete associated order items
    await models.OrderItem.destroy({ 
      where: { saleId: sale.id },
      transaction
    });

    await sale.destroy({ transaction });
    await transaction.commit();
    
    res.status(204).send();
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
});

export default router;