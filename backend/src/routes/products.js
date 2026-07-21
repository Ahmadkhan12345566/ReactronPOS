// routes/products.js
import express from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import { toObjectWithId } from '../utils/transform.js';
import ExpressError from '../utils/ExpressError.js';
import {
  Product,
  ProductVariant,
  Inventory,
  Category,
  Brand,
  Unit,
  User,
} from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';
import { isValidId } from '../utils/validation.js';

const router = express.Router();

const toNumberOrNull = (value) => {
  if (value === '' || value === undefined || value === null) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const buildProductInclude = (storeId) => {
  const inventoryInclude = {
    model: Inventory,
    as: 'inventories',
    required: false,
  };

  if (storeId) {
    inventoryInclude.where = { storeId: Number(storeId) };
  }

  return [
    { model: Category, as: 'category', attributes: ['id', 'name'] },
    { model: Brand, as: 'brand', attributes: ['id', 'name'] },
    { model: Unit, as: 'unit', attributes: ['id', 'name'] },
    { model: User, as: 'createdByUser', attributes: ['id', 'name'] },
    {
      model: ProductVariant,
      as: 'ProductVariants',
      include: [inventoryInclude],
    },
  ];
};

const buildProductResponse = (product, storeId) => {
  if (!product) return null;
  const productData = toObjectWithId(product);

  const variants = (productData.ProductVariants || [])
    .map((variant) => {
      const inventories = variant.inventories || [];
      const variantQty = inventories.reduce((sum, inv) => sum + Number(inv.qty || 0), 0);
      return {
        ...variant,
        id: variant.id,
        qty: variantQty,
        Inventories: inventories,
        inventories,
      };
    })
    .filter((variant) => {
      if (!storeId) return true;
      return (variant.inventories || []).length > 0;
    });

  if (storeId && variants.length === 0) {
    return null;
  }

  const totalQty = variants.reduce((sum, variant) => sum + Number(variant.qty || 0), 0);

  const firstVariant = variants[0] || null;
  const categoryId = productData.category?.id ?? productData.categoryId ?? null;
  const brandId = productData.brand?.id ?? productData.brandId ?? null;
  const unitId = productData.unit?.id ?? productData.unitId ?? null;
  const subCategoryId = productData.subCategoryId ?? null;
  const supplierId = productData.supplierId ?? null;
  const createdById = productData.createdByUser?.id ?? productData.createdBy ?? null;

  return {
    id: productData.id,
    name: productData.name,
    description: productData.description || '',
    status: productData.status || 'Active',
    productType: productData.productType,
    sellingType: productData.sellingType || '',
    taxType: productData.taxType || '',
    tax: productData.tax ?? null,
    discountType: productData.discountType || '',
    discountValue: productData.discountValue ?? null,
    warranties: productData.warranties || '',
    barcodeSymbology: productData.barcodeSymbology || '',
    slug: productData.slug || '',
    category: productData.category ? productData.category.name : '',
    categoryId,
    subCategoryId,
    brand: productData.brand ? productData.brand.name : '',
    brandId,
    unit: productData.unit ? productData.unit.name : '',
    unitId,
    supplierId,
    price: firstVariant ? Number(firstVariant.price || 0) : 0,
    qty: totalQty,
    image: productData.image || null,
    createdBy: productData.createdByUser ? productData.createdByUser.name : 'Unknown',
    createdById,
    ProductVariants: variants,
  };
};

// GET /products
router.get('/', authenticateToken, async (req, res) => {
  try {
    const products = await Product.findAll({
      include: buildProductInclude(),
    });

    const transformedProducts = products
      .map((product) => buildProductResponse(product))
      .filter(Boolean);

    res.json(transformedProducts);
  } catch (error) {
    console.error('GET /products error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /products
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      name, status, description, categoryId, subCategoryId, brandId, unitId,
      productType, taxType, tax, discountType, discountValue,
      warranties, barcodeSymbology, sellingType, image, supplierId, slug,
      sku, itemBarcode, price, cost, weight, quantity, quantityAlert, storeId,
      variants,
    } = req.body;

    if (!name || !name.trim()) {
      throw new ExpressError('Product name is required.', 400);
    }

    if (!productType || !['single', 'variable'].includes(productType)) {
      throw new ExpressError('Invalid product type.', 400);
    }

    const productData = {
      name: name.trim(),
      status: status || 'Active',
      description: description || null,
      categoryId: toNumberOrNull(categoryId),
      subCategoryId: toNumberOrNull(subCategoryId),
      brandId: toNumberOrNull(brandId),
      unitId: toNumberOrNull(unitId),
      productType,
      taxType: taxType || null,
      tax: toNumberOrNull(tax),
      createdBy: Number(req.user.userId),
      discountType: discountType || null,
      discountValue: toNumberOrNull(discountValue),
      warranties: warranties || null,
      barcodeSymbology: barcodeSymbology || null,
      sellingType: sellingType || null,
      image: image || null,
      supplierId: toNumberOrNull(supplierId),
      slug: slug || null,
    };

    const product = await Product.create(productData, { transaction });

    if (productType === 'single') {
      const skuValue = typeof sku === 'string' ? sku.trim() : sku;
      const priceValue = toNumberOrNull(price);
      const quantityValue = toNumberOrNull(quantity);

      if (!skuValue || priceValue === null || quantityValue === null || !storeId) {
        throw new Error('Missing required fields for single product: sku, price, quantity, storeId');
      }

      if (!isValidId(storeId)) {
        throw new ExpressError('Valid storeId is required.', 400);
      }

      const variantData = {
        productId: product.id,
        sku: skuValue,
        itemBarcode: itemBarcode || null,
        price: priceValue,
        cost: toNumber(cost),
        weight: toNumber(weight),
        createdBy: Number(req.user.userId),
      };
      const variant = await ProductVariant.create(variantData, { transaction });

      const inventoryData = {
        variantId: variant.id,
        storeId: Number(storeId),
        qty: parseInt(quantityValue, 10),
        quantityAlert: toNumber(quantityAlert),
      };
      await Inventory.create(inventoryData, { transaction });
    } else if (productType === 'variable') {
      if (!variants || !Array.isArray(variants) || variants.length === 0) {
        throw new Error('Variable product must have at least one variant.');
      }

      for (const v of variants) {
        const variantData = {
          productId: product.id,
          sku: v.sku,
          itemBarcode: v.itemBarcode || null,
          price: toNumber(v.price),
          cost: toNumber(v.cost),
          weight: toNumber(v.weight),
          attributes: v.attributes || {},
          createdBy: Number(req.user.userId),
        };
        const variant = await ProductVariant.create(variantData, { transaction });

        if (v.inventories && Array.isArray(v.inventories)) {
          for (const inv of v.inventories) {
            if (!isValidId(inv.storeId)) {
              throw new ExpressError('Valid storeId is required for inventory.', 400);
            }
            await Inventory.create({
              variantId: variant.id,
              storeId: Number(inv.storeId),
              qty: parseInt(inv.qty, 10) || 0,
              quantityAlert: toNumber(inv.quantityAlert),
            }, { transaction });
          }
        }
      }
    }

    await transaction.commit();
    res.status(201).json(toObjectWithId(product));
  } catch (error) {
    await transaction.rollback();
    console.error('POST /api/products error:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
});

// PUT /products/:id
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const productId = req.params.id;
    if (!isValidId(productId)) {
      throw new ExpressError('Invalid product id.', 400);
    }
    const { userId } = req.user;

    const product = await Product.findByPk(productId, { transaction });
    if (!product) {
      throw new Error('Product not found');
    }
    if (product.isLocked && product.lockedBy && product.lockedBy !== Number(userId)) {
      await transaction.rollback();
      return res.status(409).json({ message: 'This product is locked by another user and cannot be edited.' });
    }

    const {
      name, status, description, categoryId, subCategoryId, brandId, unitId,
      productType, taxType, tax, discountType, discountValue,
      warranties, barcodeSymbology, sellingType, image, supplierId, slug,
      variants,
    } = req.body;

    if (!name || !name.trim()) {
      throw new ExpressError('Product name is required.', 400);
    }

    if (!productType || !['single', 'variable'].includes(productType)) {
      throw new ExpressError('Invalid product type.', 400);
    }

    if (!Array.isArray(variants)) {
      throw new ExpressError('Variants must be provided as an array.', 400);
    }

    const productData = {
      name: name.trim(),
      status: status || product.status || 'Active',
      description: description || null,
      categoryId: toNumberOrNull(categoryId),
      subCategoryId: toNumberOrNull(subCategoryId),
      brandId: toNumberOrNull(brandId),
      unitId: toNumberOrNull(unitId),
      productType,
      taxType: taxType || null,
      tax: toNumberOrNull(tax),
      discountType: discountType || null,
      discountValue: toNumberOrNull(discountValue),
      warranties: warranties || null,
      barcodeSymbology: barcodeSymbology || null,
      sellingType: sellingType || null,
      image: image || null,
      supplierId: toNumberOrNull(supplierId),
      slug: slug || null,
    };

    await Product.update(productData, { where: { id: Number(productId) }, transaction });
    const updatedProduct = await Product.findByPk(productId, { transaction });
    if (!updatedProduct) {
      throw new ExpressError('Product not found', 404);
    }

    const existingVariants = await ProductVariant.findAll({
      where: { productId: Number(productId) },
      transaction,
    });
    const existingVariantIds = existingVariants.map((v) => v.id);

    const incomingVariantIds = variants
      .map((v) => v._id || v.id)
      .filter((id) => isValidId(id))
      .map((id) => Number(id));

    const variantsToDelete = existingVariantIds.filter((id) => !incomingVariantIds.includes(id));
    if (variantsToDelete.length > 0) {
      await Inventory.destroy({ where: { variantId: variantsToDelete }, transaction });
      await ProductVariant.destroy({ where: { id: variantsToDelete }, transaction });
    }

    for (const v of variants) {
      const variantData = {
        productId: updatedProduct.id,
        sku: v.sku,
        itemBarcode: v.itemBarcode || null,
        price: toNumber(v.price),
        cost: toNumber(v.cost),
        weight: toNumber(v.weight),
        attributes: v.attributes || {},
      };

      let savedVariant;
      const variantId = v._id || v.id;
      if (variantId && isValidId(variantId)) {
        await ProductVariant.update(variantData, { where: { id: Number(variantId) }, transaction });
        savedVariant = await ProductVariant.findByPk(variantId, { transaction });
      } else {
        savedVariant = await ProductVariant.create(
          { ...variantData, createdBy: Number(userId) },
          { transaction }
        );
      }

      if (!savedVariant) {
        throw new Error('Failed to save variant');
      }

      if (v.inventories && Array.isArray(v.inventories)) {
        await Inventory.destroy({ where: { variantId: savedVariant.id }, transaction });
        for (const inv of v.inventories) {
          if (!isValidId(inv.storeId)) {
            throw new ExpressError('Valid storeId is required for inventory.', 400);
          }
          await Inventory.create({
            variantId: savedVariant.id,
            storeId: Number(inv.storeId),
            qty: parseInt(inv.qty, 10) || 0,
            quantityAlert: toNumber(inv.quantityAlert),
          }, { transaction });
        }
      } else if (productType === 'single' && v.quantity !== undefined && v.storeId) {
        await Inventory.destroy({ where: { variantId: savedVariant.id }, transaction });
        if (!isValidId(v.storeId)) {
          throw new ExpressError('Valid storeId is required for inventory.', 400);
        }
        await Inventory.create({
          variantId: savedVariant.id,
          storeId: Number(v.storeId),
          qty: parseInt(v.quantity, 10) || 0,
          quantityAlert: toNumber(v.quantityAlert),
        }, { transaction });
      }
    }

    await transaction.commit();
    res.status(200).json(toObjectWithId(updatedProduct));
  } catch (error) {
    await transaction.rollback();
    console.error('PUT /api/products/:id error:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
});

// DELETE /products/:id
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const productId = req.params.id;
    if (!isValidId(productId)) {
      throw new ExpressError('Invalid product id.', 400);
    }

    const variants = await ProductVariant.findAll({
      where: { productId: Number(productId) },
      transaction,
    });
    if (variants.length > 0) {
      const variantIds = variants.map((v) => v.id);
      await Inventory.destroy({ where: { variantId: variantIds }, transaction });
      await ProductVariant.destroy({ where: { productId: Number(productId) }, transaction });
    }

    const deletedCount = await Product.destroy({ where: { id: Number(productId) }, transaction });
    if (deletedCount === 0) {
      throw new ExpressError('Product not found', 404);
    }

    await transaction.commit();
    res.status(204).send();
  } catch (error) {
    await transaction.rollback();
    console.error('DELETE /products/:id error:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
});

const populateProductDetails = async (product, storeId) => {
  const detailedProduct = await Product.findByPk(product.id || product, {
    include: buildProductInclude(storeId),
  });
  return buildProductResponse(detailedProduct, storeId);
};

// GET /products/pos
router.get('/pos', authenticateToken, async (req, res) => {
  try {
    const { storeId } = req.query;
    if (!storeId) {
      return res.status(400).json({ message: 'storeId query parameter is required.' });
    }
    if (!isValidId(storeId)) {
      return res.status(400).json({ message: 'Invalid storeId.' });
    }

    const products = await Product.findAll({
      where: { status: 'Active' },
      include: buildProductInclude(storeId),
    });

    const transformedProducts = [];
    for (const product of products) {
      const detailedProduct = buildProductResponse(product, storeId);
      if (detailedProduct) {
        transformedProducts.push(detailedProduct);
      }
    }

    res.json(transformedProducts);
  } catch (error) {
    console.error('GET /products/pos error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /products/:id/lock
router.put('/:id/lock', authenticateToken, async (req, res) => {
  const { lock, storeId } = req.body;
  const { id } = req.params;
  const { userId } = req.user;

  try {
    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid product id.' });
    }

    const numericId = Number(id);
    const numericUserId = Number(userId);

    if (lock) {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      const [updatedCount] = await Product.update(
        { isLocked: true, lockedAt: new Date(), lockedBy: numericUserId },
        {
          where: {
            id: numericId,
            [Op.or]: [
              { isLocked: false },
              { lockedAt: { [Op.lt]: twoMinutesAgo } },
              { lockedBy: numericUserId },
            ],
          },
        }
      );

      if (updatedCount === 0) {
        const product = await Product.findByPk(numericId);
        if (product && product.isLocked && product.lockedBy !== numericUserId) {
          return res.status(409).json({ message: 'Product is currently locked by another user.' });
        }
        return res.status(409).json({ message: 'Could not acquire lock. The product may be locked or does not exist.' });
      }
    } else {
      const [updatedCount] = await Product.update(
        { isLocked: false, lockedAt: null, lockedBy: null },
        { where: { id: numericId, lockedBy: numericUserId } }
      );

      if (updatedCount === 0) {
        const product = await Product.findByPk(numericId);
        if (product && product.isLocked) {
          return res.status(403).json({ message: 'You cannot unlock a product locked by another user.' });
        }
        return res.status(404).json({ message: 'Product not found or not locked by you.' });
      }
    }

    const detailedProduct = await populateProductDetails(numericId, storeId);
    if (!detailedProduct) {
      const updatedProduct = await Product.findByPk(numericId);
      return res.json(toObjectWithId(updatedProduct));
    }

    return res.json(detailedProduct);
  } catch (error) {
    console.error('SERVER ERROR during lock operation:', error);
    res.status(500).json({ message: 'Server error while updating product lock.', error: error.message });
  }
});

export default router;
