import express from 'express';
import sequelize from '../config/database.js';
import { toObjectWithId } from '../utils/transform.js';
import { SaleReturn, ReturnItem, Inventory, Customer, Product, ProductVariant, OrderItem } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';
import { isValidId } from '../utils/validation.js';

const router = express.Router();

const resolveReturnVariantId = async (item, saleId, transaction) => {
  if (isValidId(item.variantId)) {
    return Number(item.variantId);
  }
  if (!isValidId(item.productId)) {
    throw new Error('Valid productId is required for each return item.');
  }

  if (isValidId(saleId)) {
    const saleItems = await OrderItem.findAll({
      where: { saleId: Number(saleId), productId: Number(item.productId) },
      attributes: ['variantId'],
      transaction,
    });
    const variants = [
      ...new Set(saleItems.map(saleItem => saleItem.variantId).filter(Boolean).map(Number)),
    ];
    if (variants.length === 1) {
      return variants[0];
    }
    if (variants.length > 1) {
      throw new Error(`Return item for product ${item.productId} must include variantId because multiple variants were sold.`);
    }
  }

  const productVariants = await ProductVariant.findAll({
    where: { productId: Number(item.productId) },
    attributes: ['id'],
    transaction,
  });
  if (productVariants.length === 1) {
    return productVariants[0].id;
  }

  throw new Error(`Return item for product ${item.productId} must include variantId.`);
};

const updateInventoryOnReturn = async (variantId, quantity, storeId, transaction) => {
  if (!isValidId(variantId)) {
    throw new Error('Valid variantId is required to update inventory.');
  }

  const inventory = await Inventory.findOne({
    where: { variantId: Number(variantId), storeId: Number(storeId) },
    transaction,
  });

  if (inventory) {
    await inventory.increment('qty', { by: Number(quantity), transaction });
  } else {
    await Inventory.create({
      variantId: Number(variantId),
      storeId: Number(storeId),
      qty: Number(quantity),
      quantityAlert: 0,
    }, { transaction });
  }
};

// GET /sales-returns - get all sales returns
router.get('/', authenticateToken, async (req, res) => {
  try {
    const salesReturns = await SaleReturn.findAll({
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'name', 'email', 'phone', 'image'] },
        {
          model: ReturnItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'image'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const transformedReturns = salesReturns.map(returnDoc => {
      const returnData = toObjectWithId(returnDoc);
      const firstItem = returnData.items && returnData.items[0];
      const firstProduct = firstItem ? firstItem.product : null;

      return {
        id: returnData.id,
        date: returnData.date,
        status: returnData.status,
        total: returnData.total,
        paid: returnData.paid,
        due: returnData.due,
        paymentStatus: returnData.payment_status,
        customer: returnData.customer ? {
          id: returnData.customer.id,
          name: returnData.customer.name,
          email: returnData.customer.email,
          phone: returnData.customer.phone,
          avatar: returnData.customer.image
        } : null,
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
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { returnItems, storeId, customerId, saleId, sale, ...saleReturnData } = req.body;
    const saleRef = saleId || sale;

    if (!storeId || !customerId || !saleRef || !Array.isArray(returnItems) || returnItems.length === 0) {
      throw new Error('Store, customer, sale, and at least one return item are required.');
    }

    if (!isValidId(storeId) || !isValidId(customerId) || !isValidId(saleRef)) {
      throw new Error('Valid storeId, customerId, and saleId are required.');
    }

    const resolvedItems = [];
    for (const item of returnItems) {
      const resolvedVariantId = await resolveReturnVariantId(item, saleRef, transaction);
      resolvedItems.push({
        ...item,
        variantId: resolvedVariantId,
      });
    }

    const salesReturn = await SaleReturn.create({
      ...saleReturnData,
      saleId: Number(saleRef),
      customerId: Number(customerId),
      storeId: Number(storeId),
      createdBy: Number(req.user.userId),
    }, { transaction });

    await ReturnItem.bulkCreate(
      resolvedItems.map(item => ({
        saleReturnId: salesReturn.id,
        productId: Number(item.productId),
        variantId: Number(item.variantId),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        reason: item.reason || '',
        subtotal: Number(item.total)
      })),
      { transaction }
    );

    const createdItems = await ReturnItem.findAll({
      where: { saleReturnId: salesReturn.id },
      attributes: ['id'],
      transaction,
    });

    for (const item of resolvedItems) {
      await updateInventoryOnReturn(item.variantId, item.quantity, storeId, transaction);
    }

    await transaction.commit();
    const responsePayload = {
      ...toObjectWithId(salesReturn),
      items: createdItems.map(item => item.id),
    };
    res.status(201).json(responsePayload);
  } catch (error) {
    await transaction.rollback();
    console.error('POST /sales-returns error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
