// routes/products.js
import express from 'express';
import { models, sequelize } from '../models/index.js';

const router = express.Router();

// GET /products - include variants + inventories, return aggregated qty and product image
router.get('/', async (req, res) => {
  try {
    const products = await models.Product.findAll({
      include: [
        { model: models.Category, attributes: ['name'] },
        { model: models.Brand, attributes: ['name'] },
        { model: models.Unit, attributes: ['name'] },
        { model: models.User, attributes: ['name'] },
        { 
          model: models.ProductVariant,
          include: [{
            model: models.Inventory,
            required: false
      }]
        }
      ]
    });

    const transformedProducts = products.map(product => {
      const variants = product.ProductVariants || [];
      const firstVariant = variants[0] || null;

      // aggregate all inventory qty across variants & warehouses
      let totalQty = 0;
      variants.forEach(v => {
        (v.Inventories || []).forEach(inv => {
          totalQty += Number(inv.qty || 0);
        });
      });

      return {
        id: product.id,
        name: product.name,
        category: product.Category ? product.Category.name : '',
        brand: product.Brand ? product.Brand.name : '',
        price: firstVariant ? Number(firstVariant.price || 0) : Number(product.price || 0),
        unit: product.Unit ? product.Unit.name : '',
        qty: totalQty,
        image: product.image || null,
        ProductVariants: variants,
        createdBy: product.User ? product.User.name : 'Unknown'
      };
    });

    res.json(transformedProducts);
  } catch (error) {
    console.error('GET /products error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /products - create a new product, its variants, and inventory
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      name, description, categoryId, subCategoryId, brandId, unitId,
      productType, taxType, tax, createdBy, discountType, discountValue,
      warranties, barcodeSymbology, sellingType, image, supplierId, slug,
      // Single product fields
      sku, itemBarcode, price, quantity, quantityAlert, warehouseId
    } = req.body;

    // --- FIX FOR OPTIONAL FIELDS (Priority 5) ---
    // Helper function to convert empty strings to null for numeric/optional fields
    const toNull = (val) => (val === '' || val === undefined ? null : val);

    // Create the product
    const product = await models.Product.create({
      name,
      description: toNull(description),
      categoryId: toNull(categoryId),
      subCategoryId: toNull(subCategoryId),
      brandId: toNull(brandId),
      unitId: toNull(unitId),
      productType,
      taxType: toNull(taxType),
      tax: toNull(tax),
      createdBy: toNull(createdBy),
      discountType: toNull(discountType),
      discountValue: toNull(discountValue),
      warranties: toNull(warranties),
      barcodeSymbology: toNull(barcodeSymbology),
      sellingType: toNull(sellingType),
      image: toNull(image),
      supplierId: toNull(supplierId),
      slug: toNull(slug),
    }, { transaction });

    // --- FIX FOR SINGLE PRODUCT (Priority 4) ---
    if (productType === 'single') {
      // Handle as a single product with one variant
      if (!sku || !price || !quantity || !warehouseId) {
        throw new Error('Missing required fields for single product: sku, price, quantity, warehouseId');
      }

      // 1. Create the ProductVariant
      const variant = await models.ProductVariant.create({
        productId: product.id,
        sku: sku,
        itemBarcode: toNull(itemBarcode),
        price: parseFloat(price),
        cost: 0,
        weight: 0,
        attributes: {},
        expiryDate: toNull(req.body.expiryDate),
        manufacturedDate: toNull(req.body.manufacturedDate),
      }, { transaction });

      // 2. Create the Inventory entry
      await models.Inventory.create({
        variantId: variant.id,
        warehouseId: parseInt(warehouseId),
        qty: parseInt(quantity),
        quantityAlert: toNull(quantityAlert) || 0,
      }, { transaction });

    } else if (productType === 'variable') {
      // Handle as a variable product (existing logic)
      const { variants } = req.body;
      if (!variants || !Array.isArray(variants) || variants.length === 0) {
        throw new Error('Variable product must have at least one variant.');
      }

      for (const v of variants) {
        // 1. Create the ProductVariant
        const variant = await models.ProductVariant.create({
          productId: product.id,
          sku: v.sku,
          itemBarcode: toNull(v.itemBarcode),
          price: parseFloat(v.price) || 0,
          cost: toNull(v.cost) || 0,
          weight: toNull(v.weight) || 0,
          attributes: v.attributes || {},
          expiryDate: toNull(v.expiryDate),
          manufacturedDate: toNull(v.manufacturedDate),
        }, { transaction });

        // 2. Create Inventory entries
        if (v.inventories && Array.isArray(v.inventories)) {
          for (const inv of v.inventories) {
            await models.Inventory.create({
              variantId: variant.id,
              warehouseId: parseInt(inv.warehouseId),
              qty: parseInt(inv.qty) || 0,
              quantityAlert: toNull(inv.quantityAlert) || 0,
            }, { transaction });
          }
        }
      }
    }
    // --- END OF FIX ---

    await transaction.commit();
    res.status(201).json(product);
  } catch (error) {
    await transaction.rollback();
    console.error('POST /api/products error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /products/:id - update product fields; optionally update/create variants + inventories
router.put('/:id', async (req, res) => {
  try {
    const product = await models.Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { variants, image } = req.body;

    // Validate image if present
    if (image && typeof image === 'string' && !image.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid base64 image string' });
    }

    // Update product fields (image is stored as base64 text)
    await product.update(req.body);

    // Process variants array if provided
    if (Array.isArray(variants)) {
      for (const v of variants) {
        if (v.id) {
          // update existing variant
          const variant = await models.ProductVariant.findByPk(v.id);
          if (!variant) continue;
          // update allowed fields only (prevent accidental overwrite)
          await variant.update({
            sku: v.sku ?? variant.sku,
            itemBarcode: v.itemBarcode ?? variant.itemBarcode,
            price: v.price ?? variant.price,
            cost: v.cost ?? variant.cost,
            weight: v.weight ?? variant.weight,
            attributes: v.attributes ?? variant.attributes,
            expiryDate: v.expiryDate ?? variant.expiryDate,
            manufacturedDate: v.manufacturedDate ?? variant.manufacturedDate
          });

          // inventories: upsert by warehouseId
          if (Array.isArray(v.inventories)) {
            for (const inv of v.inventories) {
              if (!inv.warehouseId) continue;
              const existing = await models.Inventory.findOne({ where: { variantId: variant.id, warehouseId: inv.warehouseId } });
              if (existing) {
                await existing.update({ qty: inv.qty ?? existing.qty, quantityAlert: inv.quantityAlert ?? existing.quantityAlert });
              } else {
                await models.Inventory.create({ variantId: variant.id, warehouseId: inv.warehouseId, qty: inv.qty ?? 0, quantityAlert: inv.quantityAlert ?? 0 });
              }
            }
          }
        } else {
          // create new variant
          const newVariant = await models.ProductVariant.create({
            productId: product.id,
            sku: v.sku || null,
            itemBarcode: v.itemBarcode || null,
            price: v.price || null,
            cost: v.cost ?? 0.00,
            weight: v.weight ?? 0.00,
            attributes: v.attributes ?? null,
            expiryDate: v.expiryDate ?? null,
            manufacturedDate: v.manufacturedDate ?? null
          });

          if (Array.isArray(v.inventories)) {
            for (const inv of v.inventories) {
              if (!inv.warehouseId) continue;
              await models.Inventory.create({
                variantId: newVariant.id,
                warehouseId: inv.warehouseId,
                qty: inv.qty ?? 0,
                quantityAlert: inv.quantityAlert ?? 0
              });
            }
          }
        }
      }
    }

    const updated = await models.Product.findByPk(product.id, { include: [{ model: models.ProductVariant, include: [models.Inventory] }] });
    res.json(updated);
  } catch (error) {
    console.error('PUT /products/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /products/:id
router.delete('/:id', async (req, res) => {
  try {
    const product = await models.Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.get('/pos', async (req, res) => {
  try {
    const { warehouseId } = req.query;

    // Define the inventory where clause based on the presence of a warehouseId
    const inventoryWhereClause = warehouseId ? { warehouseId: parseInt(warehouseId) } : {};

    const products = await models.Product.findAll({
      where: { status: 'Active' },
      include: [
        { model: models.Category, attributes: ['name'] },
        { model: models.Brand, attributes: ['name'] },
        { model: models.Unit, attributes: ['name'] },
        { 
          model: models.ProductVariant,
          include: [{
            model: models.Inventory,
            where: inventoryWhereClause,
            required: !!warehouseId // Make inventory required if filtering by warehouse
          }]
        }
      ]
    });

    const transformedProducts = products.map(product => {
      const variants = product.ProductVariants || [];
      
      // Calculate total quantity based on the (potentially filtered) inventories
      let totalQty = 0;
      variants.forEach(variant => {
        if (variant.Inventories && variant.Inventories.length > 0) {
          variant.Inventories.forEach(inventory => {
            totalQty += parseInt(inventory.qty || 0);
          });
        }
      });

      // Use the first variant's price, or a default
      const price = variants[0] ? parseFloat(variants[0].price || 0) : 0;

      return {
        id: product.id,
        name: product.name,
        category: product.Category ? product.Category.name : '',
        brand: product.Brand ? product.Brand.name : '',
        price: price,
        unit: product.Unit ? product.Unit.name : '',
        qty: totalQty, // This now reflects qty for the selected warehouse if provided
        image: product.image || null,
        createdBy: product.User ? product.User.name : 'Unknown',
        ProductVariants: variants.map(variant => ({
          id: variant.id,
          price: parseFloat(variant.price || 0),
          Inventories: variant.Inventories || []
        }))
      };
    });

    res.json(transformedProducts);
  } catch (error) {
    console.error('GET /products/pos error:', error);
    res.status(500).json({ error: error.message });
  }
});
export default router;
