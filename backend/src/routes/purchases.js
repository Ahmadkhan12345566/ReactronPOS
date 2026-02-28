import express from 'express';
import sequelize from '../config/database.js';
import { Purchase, PurchaseItem, Inventory, Supplier, Product } from '../models/index.js';
import { toObjectWithId, toObjectsWithId } from '../utils/transform.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';
import { isValidId } from '../utils/validation.js';

const router = express.Router();

// Get all purchases with supplier and item information
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        { model: Supplier, as: 'supplier', attributes: ['id', 'name', 'email', 'phone'] },
        {
          model: PurchaseItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name'] }],
        },
      ],
      order: [['date', 'DESC']],
    });
    res.json(toObjectsWithId(purchases));
  } catch (error) {
    console.error('GET /purchases error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new purchase with inventory updates
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { reference, date, status, payment_status, total, paid, due, supplierId, purchaseItems } = req.body;

    const purchaseData = {
      reference,
      date: date || new Date(),
      status,
      payment_status,
      total: parseFloat(total) || 0,
      paid: parseFloat(paid) || 0,
      due: parseFloat(due) || 0,
      supplierId: supplierId ? Number(supplierId) : null,
      createdBy: Number(req.user.userId),
    };
    const purchase = await Purchase.create(purchaseData, { transaction });

    if (Array.isArray(purchaseItems) && purchaseItems.length > 0) {
      for (const item of purchaseItems) {
        const quantity = Number(item.quantity);
        const unitPrice = Number(item.unitPrice);
        const subtotal = Number(item.subtotal);
        await PurchaseItem.create({
          purchaseId: purchase.id,
          productId: Number(item.productId),
          quantity,
          unitPrice,
          subtotal: Number.isFinite(subtotal) ? subtotal : unitPrice * quantity,
        }, { transaction });

        if (item.variantId && item.storeId) {
          if (!isValidId(item.variantId) || !isValidId(item.storeId)) {
            throw new Error('Valid variantId and storeId are required for inventory.');
          }

          const inventory = await Inventory.findOne({
            where: { variantId: Number(item.variantId), storeId: Number(item.storeId) },
            transaction,
          });

          if (inventory) {
            await inventory.increment('qty', { by: Number(item.quantity), transaction });
          } else {
            await Inventory.create({
              variantId: Number(item.variantId),
              storeId: Number(item.storeId),
              qty: Number(item.quantity),
              quantityAlert: 0,
            }, { transaction });
          }
        }
      }
    }

    await transaction.commit();

    const createdPurchase = await Purchase.findByPk(purchase.id, {
      include: [
        { model: Supplier, as: 'supplier', attributes: ['id', 'name', 'email', 'phone'] },
        {
          model: PurchaseItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name'] }],
        },
      ],
    });

    res.status(201).json(toObjectWithId(createdPurchase));
  } catch (error) {
    await transaction.rollback();
    console.error('POST /purchases error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
