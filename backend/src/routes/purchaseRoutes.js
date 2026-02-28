import express from 'express';
import { Op } from 'sequelize';
import { Purchase, PurchaseItem, Product, Category, Supplier, ProductVariant, Inventory } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';
import { isValidId } from '../utils/validation.js';

const router = express.Router();

// GET /purchase/report - get purchase report data
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { startDate, endDate, supplierId } = req.query;

    const purchaseWhere = {};
    if (startDate && endDate) {
      purchaseWhere.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    if (supplierId) {
      if (!isValidId(supplierId)) {
        return res.status(400).json({ error: 'Invalid supplier id.' });
      }
      purchaseWhere.supplierId = Number(supplierId);
    }

    const purchaseItems = await PurchaseItem.findAll({
      include: [
        {
          model: Purchase,
          as: 'purchase',
          where: purchaseWhere,
          required: true,
          attributes: ['id', 'reference', 'date', 'supplierId'],
          include: [{ model: Supplier, as: 'supplier', attributes: ['id', 'name'] }],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image', 'categoryId'],
          include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
        },
      ],
    });

    const productIds = [
      ...new Set(purchaseItems.map(item => item.product?.id).filter((id) => isValidId(id))),
    ];
    const variants = productIds.length
      ? await ProductVariant.findAll({
          where: { productId: productIds },
          attributes: ['id', 'productId'],
        })
      : [];
    const variantToProduct = new Map(variants.map(variant => [variant.id, variant.productId]));
    const variantIds = variants.map(variant => variant.id);
    const inventoryRows = variantIds.length
      ? await Inventory.findAll({
          where: { variantId: variantIds },
          attributes: ['variantId', 'qty'],
        })
      : [];
    const stockByProduct = new Map();
    for (const row of inventoryRows) {
      const productId = variantToProduct.get(row.variantId);
      if (!productId) continue;
      stockByProduct.set(productId, (stockByProduct.get(productId) || 0) + Number(row.qty || 0));
    }

    const reportData = purchaseItems.map(item => {
      const purchase = item.purchase;
      const product = item.product;
      return {
        id: `${purchase.id}-${item.id}`,
        reference: purchase.reference,
        sku: `PO-${purchase.id}-${item.id}`,
        dueDate: purchase.date,
        supplier: purchase.supplier?.name || '',
        product: {
          name: product?.name || 'Unknown Product',
          image: product?.image || ''
        },
        category: product?.category?.name || 'Uncategorized',
        purchaseQty: item.quantity,
        purchaseAmount: item.subtotal || (item.unitPrice * item.quantity),
        stockQty: stockByProduct.get(product?.id) || 0
      };
    });

    res.json(reportData);
  } catch (error) {
    console.error('GET /purchase/report error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
