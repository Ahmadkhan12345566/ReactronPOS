import express from 'express';
import sequelize from '../config/database.js';
import { Sale, OrderItem, Inventory, Product, ProductVariant, Customer, User } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/transform.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';
import { isValidId } from '../utils/validation.js';

const router = express.Router();

const toFiniteNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const normalizeOrderItems = (orderItems) => {
  return orderItems.map((item) => {
    const quantity = toFiniteNumber(item.quantity);
    const unitPrice = toFiniteNumber(item.unitPrice);
    const total = toFiniteNumber(item.total, quantity * unitPrice);

    return {
      productId: Number(item.productId),
      variantId: Number(item.variantId),
      quantity,
      unitPrice,
      total,
    };
  });
};

const aggregateVariantQuantities = (items, { requirePositive = false } = {}) => {
  const map = new Map();
  for (const item of items) {
    const variantId = Number(item.variantId ?? item.variant);
    const quantity = Number(item.quantity);
    if (!isValidId(variantId)) {
      throw new Error('Valid variantId is required for each order item.');
    }
    if (!Number.isFinite(quantity) || (requirePositive && quantity <= 0)) {
      throw new Error('Order item quantity must be greater than 0.');
    }
    map.set(variantId, (map.get(variantId) || 0) + quantity);
  }
  return map;
};

const validateInventory = async (variantQuantities, storeId, transaction) => {
  if (variantQuantities.size === 0) return;
  const inventoryRows = await Inventory.findAll({
    where: { variantId: Array.from(variantQuantities.keys()), storeId: Number(storeId) },
    transaction,
  });
  const inventoryByVariant = new Map(inventoryRows.map((inv) => [inv.variantId, inv]));
  for (const [variantId, requiredQty] of variantQuantities) {
    const inventory = inventoryByVariant.get(variantId);
    if (!inventory || inventory.qty < requiredQty) {
      throw new Error(`Insufficient inventory for variant ${variantId}. Available: ${inventory?.qty || 0}, Requested: ${requiredQty}`);
    }
  }
};

const adjustInventory = async (variantQuantities, storeId, transaction, direction) => {
  for (const [variantId, quantity] of variantQuantities) {
    await Inventory.increment('qty', {
      by: direction * Number(quantity),
      where: { variantId: Number(variantId), storeId: Number(storeId) },
      transaction,
    });
  }
};

const buildSaleInclude = () => [
  { model: Customer, as: 'customer', attributes: ['id', 'name'] },
  { model: User, as: 'user', attributes: ['id', 'name'] },
  {
    model: OrderItem,
    as: 'items',
    include: [
      { model: Product, as: 'product', attributes: ['id', 'name'] },
      { model: ProductVariant, as: 'variant', attributes: ['id', 'sku', 'attributes'] },
    ],
  },
];

// GET /sales - get all sales with related info
router.get('/', authenticateToken, async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'biller') {
      where.userId = Number(req.user.userId);
    }

    const sales = await Sale.findAll({
      where,
      include: buildSaleInclude(),
      order: [['createdAt', 'DESC']],
    });

    res.json(toObjectsWithId(sales));
  } catch (error) {
    console.error('GET /sales error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /sales - create a new sale and update inventory
router.post('/', authenticateToken, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { orderItems, customerId, storeId, ...saleData } = req.body;

    if (!customerId || !storeId || !Array.isArray(orderItems) || orderItems.length === 0) {
      throw new Error('Customer, store, and at least one order item are required.');
    }

    if (!isValidId(customerId) || !isValidId(storeId)) {
      throw new Error('Valid customerId and storeId are required.');
    }

    const normalizedItems = normalizeOrderItems(orderItems);
    const requiredQuantities = aggregateVariantQuantities(normalizedItems, { requirePositive: true });

    // 1. Validate Inventory
    await validateInventory(requiredQuantities, storeId, transaction);

    // 2. Create Sale
    const sale = await Sale.create({
      ...saleData,
      customerId: Number(customerId),
      storeId: Number(storeId),
      userId: Number(req.user.userId),
    }, { transaction });

    // 3. Create OrderItem records
    await OrderItem.bulkCreate(
      normalizedItems.map(item => ({
        saleId: sale.id,
        productId: Number(item.productId),
        variantId: Number(item.variantId),
        quantity: Number(item.quantity),
        unit_price: Number(item.unitPrice),
        subtotal: Number(item.total),
      })),
      { transaction }
    );

    // 4. Decrement Inventory
    await adjustInventory(requiredQuantities, storeId, transaction, -1);

    await transaction.commit();

    const populatedSale = await Sale.findByPk(sale.id, {
      include: buildSaleInclude(),
    });

    res.status(201).json(toObjectWithId(populatedSale));
  } catch (error) {
    await transaction.rollback();
    console.error('POST /sales error:', error.stack || error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /sales/:id - Update a sale and adjust inventory
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const saleId = req.params.id;
    const { orderItems, customerId, storeId, ...saleData } = req.body;

    if (!isValidId(saleId)) {
      throw new Error('Invalid sale id');
    }

    if (!customerId || !storeId || !Array.isArray(orderItems) || orderItems.length === 0) {
      throw new Error('Customer, store, and at least one order item are required.');
    }

    if (!isValidId(customerId) || !isValidId(storeId)) {
      throw new Error('Valid customerId and storeId are required.');
    }

    const normalizedItems = normalizeOrderItems(orderItems);
    const requiredQuantities = aggregateVariantQuantities(normalizedItems, { requirePositive: true });

    // 1. Find the original sale to revert inventory
    const originalSale = await Sale.findByPk(saleId, { transaction });
    if (!originalSale) {
      throw new Error('Sale not found');
    }

    const originalOrderItems = await OrderItem.findAll({
      where: { saleId: Number(saleId) },
      transaction,
    });
    const originalQuantities = aggregateVariantQuantities(
      originalOrderItems.map(item => ({ variantId: item.variantId, quantity: item.quantity }))
    );
    await adjustInventory(originalQuantities, originalSale.storeId, transaction, 1);

    // 2. Validate inventory for the new items
    await validateInventory(requiredQuantities, storeId, transaction);

    // 3. Delete old OrderItems
    await OrderItem.destroy({ where: { saleId: Number(saleId) }, transaction });

    // 4. Create new OrderItems
    await OrderItem.bulkCreate(
      normalizedItems.map(item => ({
        saleId: Number(saleId),
        productId: Number(item.productId),
        variantId: Number(item.variantId),
        quantity: Number(item.quantity),
        unit_price: Number(item.unitPrice),
        subtotal: Number(item.total),
      })),
      { transaction }
    );

    // 5. Update Sale
    await Sale.update({
      ...saleData,
      customerId: Number(customerId),
      storeId: Number(storeId),
      userId: Number(req.user.userId),
    }, {
      where: { id: Number(saleId) },
      transaction,
    });

    // 6. Decrement inventory for new items
    await adjustInventory(requiredQuantities, storeId, transaction, -1);

    await transaction.commit();

    const updatedSale = await Sale.findByPk(saleId, {
      include: buildSaleInclude(),
    });

    res.status(200).json(toObjectWithId(updatedSale));
  } catch (error) {
    await transaction.rollback();
    console.error('PUT /sales/:id error:', error.stack || error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /sales/:id - delete a sale and restore inventory
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const saleId = req.params.id;
    if (!isValidId(saleId)) {
      throw new Error('Invalid sale id');
    }

    const sale = await Sale.findByPk(saleId, { transaction });
    if (!sale) {
      throw new Error('Sale not found');
    }

    const saleItems = await OrderItem.findAll({ where: { saleId: Number(saleId) }, transaction });
    const saleQuantities = aggregateVariantQuantities(
      saleItems.map(item => ({ variantId: item.variantId, quantity: item.quantity }))
    );
    await adjustInventory(saleQuantities, sale.storeId, transaction, 1);

    await OrderItem.destroy({ where: { saleId: Number(saleId) }, transaction });
    await Sale.destroy({ where: { id: Number(saleId) }, transaction });

    await transaction.commit();
    res.status(204).send();
  } catch (error) {
    await transaction.rollback();
    console.error('DELETE /sales/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
