// routes/products.js
import express from 'express';
import { models } from '../models/index.js';
import multer from 'multer';
import csv from 'csv-parser';
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
// Get all products with associations
// Update the GET route to work with the new model structure
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
            include: [models.Warehouse]
          }]
        }
      ]
    });
    
    // Transform data to match frontend expectations
    const transformedProducts = products.map(product => {
      // Get the first variant for display purposes
      const firstVariant = product.ProductVariants && product.ProductVariants[0];
      const inventory = firstVariant && firstVariant.Inventories && firstVariant.Inventories[0];
      
      return {
        id: product.id,
        name: product.name,
        category: product.Category ? product.Category.name : '',
        brand: product.Brand ? product.Brand.name : '',
        price: firstVariant ? firstVariant.price : 0,
        unit: product.Unit ? product.Unit.name : '',
        qty: inventory ? inventory.qty : 0,
        image: product.image,
        createdBy: product.createdBy,
      };
    });
    
    res.json(transformedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /products
// Update the POST route to properly extract all needed fields
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      status, 
      slug, 
      sellingType, 
      productType, 
      taxType, 
      tax, 
      discountType, 
      discountValue, 
      warranties, 
      barcodeSymbology, 
      image, 
      categoryId, 
      subCategoryId, 
      brandId, 
      unitId, 
      supplierId, 
      createdBy 
    } = req.body;

    // Optional: Validate base64 string
    if (image && !image.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid base64 image string' });
    }

    // Create product with the new schema
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

    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const product = await models.Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Add this to your existing products.js routes
router.post('/import', async (req, res) => {
  try {
    // Handle file upload and CSV parsing here
    // You might want to use a library like multer for file handling
    // and csv-parser for parsing the CSV file
    
    const { file } = req.files; // Assuming you're using multer
    const { product, category, subCategory, createdBy, description } = req.body;
    
    // Process the CSV file and create products
    // This is a simplified example
    
    res.status(201).json({ message: 'Products imported successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await models.Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;