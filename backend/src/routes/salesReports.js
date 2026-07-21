import express from 'express';
import { Op } from 'sequelize';
import { Sale, OrderItem, Product, Category, Brand, Store, Inventory } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';
import { isValidId } from '../utils/validation.js';

const router = express.Router();

// GET /sales-report - get sales report data
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { startDate, endDate, productId, customerId } = req.query;

    const saleWhere = {};
    if (startDate && endDate) {
      saleWhere.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    if (customerId) {
      if (!isValidId(customerId)) {
        return res.status(400).json({ error: 'Invalid customer id.' });
      }
      saleWhere.customerId = Number(customerId);
    }

    const itemWhere = {};
    if (productId) {
      if (!isValidId(productId)) {
        return res.status(400).json({ error: 'Invalid product id.' });
      }
      itemWhere.productId = Number(productId);
    }

    const orderItems = await OrderItem.findAll({
      where: itemWhere,
      include: [
        {
          model: Sale,
          as: 'sale',
          where: saleWhere,
          required: true,
          attributes: ['id', 'date', 'storeId'],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image', 'categoryId', 'brandId'],
          include: [
            { model: Category, as: 'category', attributes: ['id', 'name'] },
            { model: Brand, as: 'brand', attributes: ['id', 'name'] },
          ],
        },
      ],
    });

    const storeIds = [
      ...new Set(orderItems.map(item => item.sale?.storeId).filter((storeId) => isValidId(storeId))),
    ];
    const stores = storeIds.length
      ? await Store.findAll({ where: { id: storeIds }, attributes: ['id', 'name'] })
      : [];
    const storeNameById = new Map(stores.map(store => [store.id, store.name]));

    const variantIds = [
      ...new Set(orderItems.map(item => item.variantId).filter((variantId) => isValidId(variantId))),
    ];
    const inventoryRows = variantIds.length && storeIds.length
      ? await Inventory.findAll({
          where: { variantId: variantIds, storeId: storeIds },
          attributes: ['variantId', 'storeId', 'qty'],
        })
      : [];
    const inventoryByVariantStore = new Map(
      inventoryRows.map(row => [`${row.variantId}-${row.storeId}`, Number(row.qty || 0)])
    );

    const reportData = orderItems.map(item => ({
      id: `${item.sale.id}-${item.id}`,
      sku: `SO-${item.sale.id}-${item.id}`,
      date: item.sale.date,
      dueDate: item.sale.date,
      storeId: item.sale.storeId,
      store: storeNameById.get(item.sale.storeId) || '',
      product: {
        name: item.product?.name || 'Unknown Product',
        image: item.product?.image || '',
        brand: item.product?.brand?.name || 'No Brand'
      },
      category: item.product?.category?.name || 'Uncategorized',
      soldQty: item.quantity,
      soldAmount: item.subtotal,
      stockQty: inventoryByVariantStore.get(`${item.variantId}-${item.sale.storeId}`) || 0
    }));

    res.json(reportData);
  } catch (error) {
    console.error('GET /sales-report error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
