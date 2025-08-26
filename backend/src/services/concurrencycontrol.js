// services/concurrencyControl.js
import { models, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

export class ConcurrencyControlService {
  
  // Optimistic locking for product updates
  static async updateProductWithLock(productId, updates, currentVersion) {
    const transaction = await sequelize.transaction();
    
    try {
      const product = await models.Product.findOne({
        where: { 
          id: productId, 
          version: currentVersion 
        },
        lock: true,
        transaction
      });

      if (!product) {
        throw new Error('Product not found or has been modified by another user');
      }

      // Update with version increment
      await product.update({
        ...updates,
        version: product.version + 1
      }, { transaction });

      await transaction.commit();
      return product;
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Atomic inventory updates for sales
  static async processSaleWithInventoryCheck(saleData, items) {
    const transaction = await sequelize.transaction();
    
    try {
      // First, check and reserve inventory
      const productUpdates = [];
      
      for (const item of items) {
        const product = await models.Product.findByPk(item.productId, {
          lock: true,
          transaction
        });

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.qty < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.qty}, Requested: ${item.quantity}`);
        }

        productUpdates.push({
          product,
          newQty: product.qty - item.quantity
        });
      }

      // Create the sale
      const sale = await models.Sale.create({
        ...saleData,
        reference: await this.generateReference('SL'),
        date: new Date()
      }, { transaction });

      // Create sale items and update inventory
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const { product, newQty } = productUpdates[i];

        // Create sale item
        await models.OrderItem.create({
          saleId: sale.id,
          productId: item.productId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          discount: item.discount || 0,
          subtotal: item.subtotal
        }, { transaction });

        // Update product inventory
        await product.update({ 
          qty: newQty,
          version: product.version + 1
        }, { transaction });
      }

      await transaction.commit();
      return sale;
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Handle concurrent purchase processing
  static async processPurchaseWithInventoryUpdate(purchaseData, items) {
    const transaction = await sequelize.transaction();
    
    try {
      // Create the purchase
      const purchase = await models.Purchase.create({
        ...purchaseData,
        reference: await this.generateReference('PO'),
        date: new Date()
      }, { transaction });

      // Process each item
      for (const item of items) {
        // Create purchase item
        await models.PurchaseItem.create({
          purchaseId: purchase.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          subtotal: item.subtotal
        }, { transaction });

        // Update product inventory atomically
        await models.Product.increment('qty', {
          by: item.quantity,
          where: { id: item.productId },
          transaction
        });

        // Also increment version for optimistic locking
        await models.Product.increment('version', {
          by: 1,
          where: { id: item.productId },
          transaction
        });
      }

      await transaction.commit();
      return purchase;
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Generate unique references with database-level uniqueness
  static async generateReference(prefix) {
    const transaction = await sequelize.transaction();
    
    try {
      // Create or get sequence table for references
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS reference_sequences (
          prefix VARCHAR(10) PRIMARY KEY,
          last_number INT DEFAULT 0
        )
      `, { transaction });

      // Atomically increment and get next number
      const [results] = await sequelize.query(`
        INSERT INTO reference_sequences (prefix, last_number) 
        VALUES ('${prefix}', 1) 
        ON DUPLICATE KEY UPDATE last_number = last_number + 1
      `, { transaction });

      const [sequence] = await sequelize.query(`
        SELECT last_number FROM reference_sequences WHERE prefix = '${prefix}'
      `, { transaction });

      const number = sequence[0].last_number;
      const reference = `${prefix}${String(number).padStart(6, '0')}`;

      await transaction.commit();
      return reference;
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Real-time sync mechanism using database triggers/polling
  static async getDataChanges(lastSyncTimestamp, userId) {
    const changes = {
      products: [],
      sales: [],
      customers: [],
      inventory: []
    };

    // Get all changes since last sync
    const modifiedProducts = await models.Product.findAll({
      where: {
        updatedAt: { [Op.gt]: lastSyncTimestamp }
      },
      attributes: ['id', 'name', 'qty', 'price', 'version', 'updatedAt']
    });

    const modifiedSales = await models.Sale.findAll({
      where: {
        updatedAt: { [Op.gt]: lastSyncTimestamp }
      },
      include: [
        { model: models.Customer, attributes: ['name'] },
        { model: models.OrderItem }
      ]
    });

    changes.products = modifiedProducts;
    changes.sales = modifiedSales;
    changes.lastSync = new Date();

    return changes;
  }

  // Lock management for critical operations
  static async acquireGlobalLock(lockName, timeoutMs = 10000) {
    const lockQuery = `SELECT GET_LOCK('${lockName}', ${timeoutMs / 1000}) as acquired`;
    const [result] = await sequelize.query(lockQuery);
    return result[0].acquired === 1;
  }

  static async releaseGlobalLock(lockName) {
    const unlockQuery = `SELECT RELEASE_LOCK('${lockName}') as released`;
    const [result] = await sequelize.query(unlockQuery);
    return result[0].released === 1;
  }
}