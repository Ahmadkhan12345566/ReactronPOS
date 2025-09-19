// routes/products.js
import express from 'express';
import { models } from '../models/index.js';

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
        createdBy: product.User ? product.User.name : 'Unknown'
      };
    });

    res.json(transformedProducts);
  } catch (error) {
    console.error('GET /products error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /products - create product, optional variants array
// Expected body: product fields + optional "variants": [{ sku, itemBarcode, price, cost, weight, attributes, expiryDate, manufacturedDate, inventories: [{warehouseId, qty, quantityAlert}] }, ...]
router.post('/', async (req, res) => {
  try {
    const { 
      name, description, status, slug, sellingType, productType, taxType, tax,
      discountType, discountValue, warranties, barcodeSymbology, image,
      categoryId, subCategoryId, brandId, unitId, supplierId, createdBy,
      // For single default variant:
      price, cost, weight,
      variants // optional array
    } = req.body;
    console.log("price: "+ price);

    if (!name) return res.status(400).json({ error: 'name is required' });

    // Basic image validation (optional): ensure it starts with data:image/ if present
    if (image && typeof image === 'string' && !image.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid base64 image string' });
    }

    // Create product (image stored as base64 text if provided)
    const product = await models.Product.create({
      name,
      description,
      status: status || 'Active',
      slug,
      sellingType,
      productType,
      taxType,
      tax,
      discountType,
      discountValue,
      warranties,
      barcodeSymbology,
      image: image || null,
      categoryId,
      subCategoryId,
      brandId,
      unitId,
      supplierId,
      createdBy
    });

    // Helper - create variant + inventories
    if (Array.isArray(variants) && variants.length) {
      for (const v of variants) {
        const variant = await models.ProductVariant.create({
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
              variantId: variant.id,
              warehouseId: inv.warehouseId,
              qty: inv.qty ?? 0,
              quantityAlert: inv.quantityAlert ?? 0
            });
          }
        }
      }
    } else {
      // No variants provided: if single-type product, create a default variant using product-level price/cost/weight if available
      if (productType === 'single') {
        const defaultVariant = await models.ProductVariant.create({
          productId: product.id,
          sku: `DEF-${product.id}`,
          itemBarcode: null,
          price: price ?? 0.00,
          cost: cost ?? 0.00,
          weight: weight ?? 0.00,
          attributes: null,
          expiryDate: null,
          manufacturedDate: null
        });

        // If product-level inventories are provided on body as inventories, create them:
        if (Array.isArray(req.body.inventories)) {
          for (const inv of req.body.inventories) {
            if (!inv.warehouseId) continue;
            await models.Inventory.create({
              variantId: defaultVariant.id,
              warehouseId: inv.warehouseId,
              qty: inv.qty ?? 0,
              quantityAlert: inv.quantityAlert ?? 0
            });
          }
        }
      }
    }

    // Return created product with its variants
    const created = await models.Product.findByPk(product.id, {
      include: [{ model: models.ProductVariant, include: [models.Inventory] }]
    });

    res.status(201).json(created);
  } catch (error) {
    console.error('POST /products error:', error);
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

// Simple stub for CSV import (keep it simple / use multer+csv-parser in future)
router.post('/import', async (req, res) => {
  // leave as a TODO or implement a server-side CSV parser that builds
  // the same payload shape as POST /products (product + variants)
  res.status(501).json({ message: 'CSV import not implemented in this minimal route' });
});

// Add this route to products.js
// GET /products/pos - get products with variants and inventory for POS
// Update the /pos endpoint to return the correct structure
router.get('/pos', async (req, res) => {
  try {
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
            required: false  // Remove the where clause to include all warehouses
          }]
        }
      ]
    });

    const transformedProducts = products.map(product => {
      const variants = product.ProductVariants || [];
      
      // Calculate total quantity across all variants and warehouses
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
        qty: totalQty, // This is the total available quantity across all warehouses
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
