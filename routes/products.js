// routes/products.js
import express from 'express';
import mongoose from 'mongoose';
import { toObjectWithId } from '../utils/mongoose.js';
import { Product, ProductVariant, Inventory, Category, Brand, Unit, User } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';

const router = express.Router();

// GET /products - This is a data-intensive route.
// The implementation below uses multiple queries in a loop (N+1 problem) for simplicity of implementation.
// For production, this should be optimized into a single, more complex aggregation pipeline using $lookup.
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('brand', 'name')
      .populate('unit', 'name')
      .populate('createdBy', 'name')
      .lean();

    for (const product of products) {
      const variants = await ProductVariant.find({ product: product._id }).lean();
      let totalQty = 0;
      for (const variant of variants) {
        const inventories = await Inventory.find({ variant: variant._id }).lean();
        variant.Inventories = inventories;
        inventories.forEach(inv => {
          totalQty += Number(inv.qty || 0);
        });
      }
      product.ProductVariants = variants;
      product.qty = totalQty;
    }

    const transformedProducts = products.map(product => {
      const firstVariant = product.ProductVariants && product.ProductVariants[0] ? product.ProductVariants[0] : null;
      return {
        id: product._id.toString(),
        name: product.name,
        category: product.category ? product.category.name : '',
        brand: product.brand ? product.brand.name : '',
        price: firstVariant ? Number(firstVariant.price || 0) : 0,
        unit: product.unit ? product.unit.name : '',
        qty: product.qty,
        image: product.image || null,
        createdBy: product.createdBy ? product.createdBy.name : 'Unknown',
        ProductVariants: product.ProductVariants.map(v => ({...v, id: v._id.toString()})),
      };
    });

    res.json(transformedProducts);
  } catch (error) {
    console.error('GET /products error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /products - create a new product, its variants, and inventory using a transaction
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      name, description, categoryId, subCategoryId, brandId, unitId,
      productType, taxType, tax, discountType, discountValue,
      warranties, barcodeSymbology, sellingType, image, supplierId, slug,
      sku, itemBarcode, price, cost, weight, quantity, quantityAlert, storeId,
      variants
    } = req.body;

    const toNull = (val) => (val === '' || val === undefined ? null : val);

    const productData = {
      name,
      description: toNull(description),
      category: toNull(categoryId),
      subCategory: toNull(subCategoryId),
      brand: toNull(brandId),
      unit: toNull(unitId),
      productType,
      taxType: toNull(taxType),
      tax: toNull(tax),
      createdBy: req.user.userId,
      discountType: toNull(discountType),
      discountValue: toNull(discountValue),
      warranties: toNull(warranties),
      barcodeSymbology: toNull(barcodeSymbology),
      sellingType: toNull(sellingType),
      image: toNull(image),
      supplier: toNull(supplierId),
      slug: toNull(slug),
    };

    const createdProduct = await Product.create([productData], { session });
    const product = createdProduct[0];

    if (productType === 'single') {
      if (!sku || !price || !quantity || !storeId) {
        throw new Error('Missing required fields for single product: sku, price, quantity, storeId');
      }

      const variantData = {
        product: product._id, sku, itemBarcode: toNull(itemBarcode), price: parseFloat(price),
        cost: toNull(cost) || 0, weight: toNull(weight) || 0, createdBy: req.user.userId
      };
      const [variant] = await ProductVariant.create([variantData], { session });

      const inventoryData = {
        variant: variant._id, store: storeId, qty: parseInt(quantity),
        quantityAlert: toNull(quantityAlert) || 0,
      };
      await Inventory.create([inventoryData], { session });

    } else if (productType === 'variable') {
      if (!variants || !Array.isArray(variants) || variants.length === 0) {
        throw new Error('Variable product must have at least one variant.');
      }
      for (const v of variants) {
        const variantData = {
          product: product._id, sku: v.sku, itemBarcode: toNull(v.itemBarcode),
          price: parseFloat(v.price) || 0, cost: toNull(v.cost) || 0,
          weight: toNull(v.weight) || 0, attributes: v.attributes || {}, createdBy: req.user.userId
        };
        const [variant] = await ProductVariant.create([variantData], { session });
        
        if (v.inventories && Array.isArray(v.inventories)) {
          for (const inv of v.inventories) {
            await Inventory.create([{
              variant: variant._id, store: inv.storeId,
              qty: parseInt(inv.qty) || 0, quantityAlert: toNull(inv.quantityAlert) || 0,
            }], { session });
          }
        }
      }
    }

    await session.commitTransaction();
    res.status(201).json(toObjectWithId(product));
  } catch (error) {
    await session.abortTransaction();
    console.error('POST /api/products error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
});

// PUT /products/:id - Update a product, its variants, and inventory
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const productId = req.params.id;
        const { userId } = req.user;
        
        // --- Lock Check ---
        const product = await Product.findById(productId).session(session);
        if (!product) {
            throw new Error('Product not found');
        }
        if (product.isLocked && product.lockedBy && product.lockedBy.toString() !== userId) {
            await session.abortTransaction();
            return res.status(409).json({ message: 'This product is locked by another user and cannot be edited.' });
        }
        // --- End Lock Check ---

        const {
            name, description, categoryId, subCategoryId, brandId, unitId,
            productType, taxType, tax, discountType, discountValue,
            warranties, barcodeSymbology, sellingType, image, supplierId, slug,
            variants // Expect variants to be an array for both single and variable
        } = req.body;

        const toNull = (val) => (val === '' || val === undefined ? null : val);

        const productData = {
            name,
            description: toNull(description),
            category: toNull(categoryId),
            subCategory: toNull(subCategoryId),
            brand: toNull(brandId),
            unit: toNull(unitId),
            productType,
            taxType: toNull(taxType),
            tax: toNull(tax),
            // Do not update createdBy on edit
            discountType: toNull(discountType),
            discountValue: toNull(discountValue),
            warranties: toNull(warranties),
            barcodeSymbology: toNull(barcodeSymbology),
            sellingType: toNull(sellingType),
            image: toNull(image),
            supplier: toNull(supplierId),
            slug: toNull(slug),
        };

        const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true, session });
        
        // Get current variants from DB
        const existingVariants = await ProductVariant.find({ product: productId }).session(session);
        const existingVariantIds = existingVariants.map(v => v._id.toString());
        
        const incomingVariantIds = variants.map(v => v._id).filter(id => id);

        // Variants to delete are those in DB but not in the incoming request
        const variantsToDelete = existingVariantIds.filter(id => !incomingVariantIds.includes(id));
        if (variantsToDelete.length > 0) {
            await Inventory.deleteMany({ variant: { $in: variantsToDelete } }).session(session);
            await ProductVariant.deleteMany({ _id: { $in: variantsToDelete } }).session(session);
        }
        
        // Update or Create variants
        for (const v of variants) {
            const variantData = {
                product: updatedProduct._id,
                sku: v.sku,
                itemBarcode: toNull(v.itemBarcode),
                price: parseFloat(v.price) || 0,
                cost: toNull(v.cost) || 0,
                weight: toNull(v.weight) || 0,
                attributes: v.attributes || {},
                // Do not update createdBy on edit
            };

            let savedVariant;
            if (v._id) { // Existing variant: update it
                savedVariant = await ProductVariant.findByIdAndUpdate(v._id, variantData, { new: true, session });
            } else { // New variant: create it
                const [newVariant] = await ProductVariant.create([{...variantData, createdBy: userId}], { session });
                savedVariant = newVariant;
            }

            // Handle inventory for the variant
            if (v.inventories && Array.isArray(v.inventories)) {
                // For simplicity, we can remove old inventory and add new.
                // A more optimized approach would be to update existing ones.
                await Inventory.deleteMany({ variant: savedVariant._id }).session(session);
                for (const inv of v.inventories) {
                    await Inventory.create([{
                        variant: savedVariant._id,
                        store: inv.storeId,
                        qty: parseInt(inv.qty) || 0,
                        quantityAlert: toNull(inv.quantityAlert) || 0,
                    }], { session });
                }
            } else if (productType === 'single' && v.quantity !== undefined && v.storeId) {
                // Simplified handling for single product from top-level
                await Inventory.deleteMany({ variant: savedVariant._id }).session(session);
                await Inventory.create([{
                    variant: savedVariant._id,
                    store: v.storeId,
                    qty: parseInt(v.quantity) || 0,
                    quantityAlert: toNull(v.quantityAlert) || 0,
                }], { session });
            }
        }

        await session.commitTransaction();
        res.status(200).json(toObjectWithId(updatedProduct));
    } catch (error) {
        await session.abortTransaction();
        console.error('PUT /api/products/:id error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        session.endSession();
    }
});

// DELETE /products/:id - Deletes a product and its related variants and inventory
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const productId = req.params.id;
  
      // Find variants associated with the product
      const variants = await ProductVariant.find({ product: productId }).session(session);
      if (variants.length > 0) {
        const variantIds = variants.map(v => v._id);
        // Delete inventories for these variants
        await Inventory.deleteMany({ variant: { $in: variantIds } }).session(session);
        // Delete variants
        await ProductVariant.deleteMany({ product: productId }).session(session);
      }
  
      // Delete the main product
      const deletedProduct = await Product.findByIdAndDelete(productId).session(session);
      if (!deletedProduct) {
        throw new Error('Product not found');
      }
  
      await session.commitTransaction();
      res.status(204).send();
    } catch (error) {
      await session.abortTransaction();
      console.error('DELETE /products/:id error:', error);
      res.status(500).json({ error: error.message });
    } finally {
      session.endSession();
    }
});

const populateProductDetails = async (product, storeId) => {
    const productObj = product.toObject ? product.toObject() : product;

    const variants = await ProductVariant.find({ product: productObj._id }).lean();
    let totalQty = 0;
    const variantsForProduct = [];

    for (const variant of variants) {
        const inventoryWhere = { variant: variant._id };
        if (storeId) {
            inventoryWhere.store = storeId;
        }
        const inventories = await Inventory.find(inventoryWhere).lean();
        
        if (storeId && inventories.length === 0) {
            continue; // Skip variant if not in the specified store
        }

        let variantQty = 0;
        inventories.forEach(inv => {
            variantQty += Number(inv.qty || 0);
        });

        variant.Inventories = inventories;
        totalQty += variantQty;
        variantsForProduct.push(variant);
    }
    
    if (variantsForProduct.length === 0 && storeId) {
        return null; // Skip product if no variants are in the specified store
    }

    const firstVariant = variantsForProduct.length > 0 ? variantsForProduct[0] : null;

    return {
        ...productObj,
        id: productObj._id.toString(),
        category: productObj.category?.name || '',
        brand: productObj.brand?.name || '',
        unit: productObj.unit?.name || '',
        price: firstVariant ? Number(firstVariant.price || 0) : 0,
        qty: totalQty,
        ProductVariants: variantsForProduct.map(v => ({...v, id: v._id.toString()}))
    };
};

// GET /products/pos - also has N+1 problem.
router.get('/pos', async (req, res) => {
    try {
        const { storeId } = req.query;
        if (!storeId) {
            return res.status(400).json({ message: 'storeId query parameter is required.' });
        }
    
        const products = await Product.find({ status: 'Active' })
            .populate('category', 'name')
            .populate('brand', 'name')
            .populate('unit', 'name')
            .lean();
    
        const transformedProducts = [];
        for (const product of products) {
            const detailedProduct = await populateProductDetails(product, storeId);
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


// Route to lock/unlock a product with a timeout (ATOMIC UPDATE with LOGGING)
router.put('/:id/lock', authenticateToken, async (req, res) => {
    const { lock, storeId } = req.body;
    const { id } = req.params;
    const { userId } = req.user;

    try {
        let updatedProductDoc;
        if (lock) {
            const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
            const query = {
                _id: id,
                $or: [
                    { isLocked: false },
                    { lockedAt: { $lt: twoMinutesAgo } },
                    { lockedBy: userId }
                ]
            };
            const update = { $set: { isLocked: true, lockedAt: new Date(), lockedBy: userId } };
            updatedProductDoc = await Product.findOneAndUpdate(query, update, { new: true });

            if (!updatedProductDoc) {
                const product = await Product.findById(id).lean();
                if (product && product.isLocked && product.lockedBy?.toString() !== userId) {
                    return res.status(409).json({ message: 'Product is currently locked by another user.' });
                }
                return res.status(409).json({ message: 'Could not acquire lock. The product may be locked or does not exist.' });
            }
        } else {
            const update = { $set: { isLocked: false, lockedAt: null, lockedBy: null } };
            updatedProductDoc = await Product.findOneAndUpdate({ _id: id, lockedBy: userId }, update, { new: true });

            if (!updatedProductDoc) {
                const product = await Product.findById(id).lean();
                if (product && product.isLocked) {
                    return res.status(403).json({ message: 'You cannot unlock a product locked by another user.' });
                }
                return res.status(404).json({ message: 'Product not found or not locked by you.' });
            }
        }

        // After any successful lock/unlock, populate the full details before responding.
        const detailedProduct = await populateProductDetails(updatedProductDoc, storeId);
        if (!detailedProduct) {
            // This might happen if the product is no longer in the specified store after the update.
            // Still, we should return the basic updated doc.
            return res.json(updatedProductDoc.toObject({ getters: true, virtuals: true, transform: (doc, ret) => { ret.id = ret._id; } }));
        }

        return res.json(detailedProduct);
        
    } catch (error) {
        console.error(`SERVER ERROR during lock operation:`, error);
        res.status(500).json({ message: 'Server error while updating product lock.', error: error.message });
    }
});

export default router;