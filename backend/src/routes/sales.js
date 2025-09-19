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
        { model: models.OrderItem, include: [models.Product] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(sales);
  } catch (error) {
    console.error('GET /sales error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /sales - create sale with order items
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();
  
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
    // Update the inventory validation section
    if (Array.isArray(orderItems) && orderItems.length > 0) {
      for (const item of orderItems) {
        let variant;
        
        // If variantId is provided, try to find that specific variant
        if (item.variantId) {
          variant = await models.ProductVariant.findByPk(item.variantId, {
            include: [{
              model: models.Inventory,
              required: false  // Remove the warehouse filter
            }],
            transaction
          });
        } else {
          // If no variantId, try to find the first variant for the product
          variant = await models.ProductVariant.findOne({
            where: { productId: item.productId },
            include: [{
              model: models.Inventory,
              required: false  // Remove the warehouse filter
            }],
            transaction
          });
        }

        if (!variant) {
          await transaction.rollback();
          return res.status(400).json({ 
            error: item.variantId 
              ? `Variant ${item.variantId} not found` 
              : `No variants found for product ${item.productId}`
          });
        }

        // Calculate available quantity across all warehouses
        let availableQty = 0;
        if (variant.Inventories && variant.Inventories.length > 0) {
          variant.Inventories.forEach(inventory => {
            availableQty += parseInt(inventory.qty || 0);
          });
        }

        if (availableQty < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({ 
            error: `Insufficient inventory for product ${item.productId}. Available: ${availableQty}, Requested: ${item.quantity}` 
          });
        }
      }
    }

    // Create sale
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

    // Create order items and update inventory
    if (Array.isArray(orderItems) && orderItems.length > 0) {
      for (const item of orderItems) {
        await models.OrderItem.create({
          saleId: sale.id,
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total
        }, { transaction });

        // Update inventory
        if (item.variantId) {
          // Update specific variant inventory
          const inventory = await models.Inventory.findOne({
            where: { 
              variantId: item.variantId,
              warehouseId: 1 // Assuming default warehouse
            },
            transaction
          });

          if (inventory) {
            await inventory.decrement('qty', { 
              by: item.quantity,
              transaction
            });
          } else {
            // Create inventory record if it doesn't exist
            await models.Inventory.create({
              variantId: item.variantId,
              warehouseId: 1,
              qty: -item.quantity, // Negative since we're deducting
              quantityAlert: 0
            }, { transaction });
          }
        } else {
          // Update the inventory update section
if (item.variantId) {
  // Find or create inventory record for this variant (any warehouse)
  const inventory = await models.Inventory.findOne({
    where: { 
      variantId: item.variantId
    },
    transaction
  });

  if (inventory) {
    await inventory.decrement('qty', { 
      by: item.quantity,
      transaction
    });
  } else {
    // Create inventory record if it doesn't exist (use warehouse 1 as default)
    await models.Inventory.create({
      variantId: item.variantId,
      warehouseId: 1, // Default to warehouse 1 if creating new
      qty: -item.quantity,
      quantityAlert: 0
    }, { transaction });
  }
} else {
            // Update product inventory (first variant)
            const variant = await models.ProductVariant.findOne({
              where: { productId: item.productId },
              transaction
            });

            if (variant) {
              const inventory = await models.Inventory.findOne({
                where: { 
                  variantId: variant.id
                },
                transaction
              });

              if (inventory) {
                await inventory.decrement('qty', { 
                  by: item.quantity,
                  transaction
                });
              } else {
                // Create inventory record if it doesn't exist
                await models.Inventory.create({
                  variantId: variant.id,
                  warehouseId: 1, // Default to warehouse 1
                  qty: -item.quantity,
                  quantityAlert: 0
                }, { transaction });
              }
            }
          }
        }
      }
    }

    await transaction.commit();

    // Return created sale with order items
    const createdSale = await models.Sale.findByPk(sale.id, {
      include: [
        { model: models.Customer, attributes: ['name'] },
        { model: models.User, attributes: ['name'] },
        { model: models.OrderItem, include: [models.Product] }
      ]
    });

    res.status(201).json(createdSale);
  } catch (error) {
    await transaction.rollback();
    console.error('POST /sales error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /sales/:id - update sale
router.put('/:id', async (req, res) => {
  try {
    const sale = await models.Sale.findByPk(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });

    await sale.update(req.body);

    // Update order items if provided
    if (Array.isArray(req.body.orderItems)) {
      // First remove existing order items
      await models.OrderItem.destroy({ where: { saleId: sale.id } });

      // Then create new ones
      for (const item of req.body.orderItems) {
        await models.OrderItem.create({
          saleId: sale.id,
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: item.quantity || 0,
          unitPrice: item.unitPrice || 0,
          total: item.total || 0
        });
      }
    }

    const updatedSale = await models.Sale.findByPk(sale.id, {
      include: [
        { model: models.Customer, attributes: ['name'] },
        { model: models.User, attributes: ['name'] },
        { model: models.OrderItem, include: [models.Product] }
      ]
    });

    res.json(updatedSale);
  } catch (error) {
    console.error('PUT /sales/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /sales/:id
router.delete('/:id', async (req, res) => {
  try {
    const sale = await models.Sale.findByPk(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });

    // Delete associated order items first
    await models.OrderItem.destroy({ where: { saleId: sale.id } });

    await sale.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;