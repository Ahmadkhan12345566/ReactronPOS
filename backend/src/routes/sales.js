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
      warehouseId, // Extract warehouseId from body
      orderItems
    } = req.body;

    if (!reference || !customerId || !warehouseId) { // Validate warehouseId
      await transaction.rollback();
      return res.status(400).json({ error: 'Reference, customer, and warehouse are required' });
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
            where: { warehouseId: warehouseId }, // Use validated warehouseId
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

        const inventory = variant.Inventories && variant.Inventories[0];
        const availableQty = inventory ? parseInt(inventory.qty || 0) : 0;

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
      userId,
      warehouseId // Save warehouseId to the Sale
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
          console.log(`Processing sale for variantId: ${item.variantId}, warehouseId: ${warehouseId}`);
          const inventory = await models.Inventory.findOne({
            where: { 
              variantId: item.variantId,
              warehouseId: warehouseId // Use validated warehouseId
            },
            transaction
          });

          if (inventory) {
            console.log(`Found inventory: ${inventory.id}, current qty: ${inventory.qty}. Decrementing by: ${item.quantity}`);
            await inventory.decrement('qty', { 
              by: item.quantity,
              transaction
            });
            console.log(`Inventory ${inventory.id} decremented.`);
          } else {
            console.error(`Inventory record not found for variantId: ${item.variantId}, warehouseId: ${warehouseId}. This should not happen.`);
            // This should not happen if validation was correct.
            // Throw an error to ensure data integrity.
            throw new Error(`Inventory record not found for variant ${item.variantId} in warehouse ${warehouseId} during sale processing. This indicates a data inconsistency.`);
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
      // First, restore inventory for the old items
      const oldOrderItems = await models.OrderItem.findAll({ where: { saleId: sale.id }, transaction });
      for (const item of oldOrderItems) {
        const inventory = await models.Inventory.findOne({
          where: { variantId: item.variantId, warehouseId: sale.warehouseId },
          transaction
        });
        if (inventory) {
          await inventory.increment('qty', { by: item.quantity, transaction });
        }
      }

      // Then, remove existing order items
      await models.OrderItem.destroy({ 
        where: { saleId: sale.id },
        transaction
      });

      // Then create new ones with inventory validation and decrement
      for (const item of req.body.orderItems) {
        if (!item.variantId) {
          await transaction.rollback();
          return res.status(400).json({ 
            error: 'Variant ID is required for all order items' 
          });
        }

        // Validate inventory for the new items in the correct warehouse
        const variant = await models.ProductVariant.findByPk(item.variantId, {
          include: [{
            model: models.Inventory,
            where: { warehouseId: sale.warehouseId }, // Use sale's warehouseId
            required: false
          }],
          transaction
        });

        if (!variant) {
          await transaction.rollback();
          return res.status(400).json({ error: `Variant ${item.variantId} not found` });
        }

        const inventory = variant.Inventories && variant.Inventories[0];
        const availableQty = inventory ? parseInt(inventory.qty || 0) : 0;

        if (availableQty < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({ 
            error: `Insufficient inventory for variant ${item.variantId} in warehouse. Available: ${availableQty}, Requested: ${item.quantity}` 
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

        // Decrement inventory from the correct warehouse
        if (inventory) {
          await inventory.decrement('qty', { by: item.quantity, transaction });
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

// DELETE /sales/:id - delete a sale and restore inventory
router.delete('/:id', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const sale = await models.Sale.findByPk(req.params.id, { 
      include: [models.OrderItem], // Include order items to be restored
      transaction 
    });
    if (!sale) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    const saleWarehouseId = sale.warehouseId;
    const orderItems = sale.OrderItems;

    // Restore inventory for each order item
    for (const item of orderItems) {
      if (item.variantId) {
        const inventory = await models.Inventory.findOne({
          where: { 
            variantId: item.variantId,
            warehouseId: saleWarehouseId // Use the sale's warehouseId
          },
          transaction
        });

        if (inventory) {
          await inventory.increment('qty', { 
            by: item.quantity,
            transaction
          });
        } else {
          // This case should ideally not happen if data is consistent,
          // but as a fallback, create an inventory record.
          await models.Inventory.create({
            variantId: item.variantId,
            warehouseId: saleWarehouseId,
            qty: item.quantity,
            quantityAlert: 0 // Default alert quantity
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