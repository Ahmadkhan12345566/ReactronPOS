import express from 'express';
import { models, sequelize } from '../models/index.js';

const router = express.Router();

// GET /api/dashboard - get dashboard statistics
router.get('/', async (req, res) => {
  try {
    console.log('Fetching dashboard data...');

    // Get basic counts
    const totalOrders = await models.Sale.count();
    const totalCustomers = await models.Customer.count();
    const totalProducts = await models.Product.count();

    // Get total revenue from sales
    const totalRevenueResult = await models.Sale.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total')), 'totalRevenue']
      ],
      raw: true
    });

    const totalRevenue = parseFloat(totalRevenueResult?.totalRevenue) || 0;

    // Get payment status summaries
    const paidResult = await models.Sale.findOne({
      where: { payment_status: 'Paid' },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('paid')), 'totalPaid']
      ],
      raw: true
    });

    const unpaidResult = await models.Sale.findOne({
      where: { payment_status: 'Unpaid' },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('due')), 'totalUnpaid']
      ],
      raw: true
    });

    const overdueResult = await models.Sale.findOne({
      where: { payment_status: 'Overdue' },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('due')), 'totalOverdue']
      ],
      raw: true
    });

    const totalPaid = parseFloat(paidResult?.totalPaid) || 0;
    const totalUnpaid = parseFloat(unpaidResult?.totalUnpaid) || 0;
    const totalOverdue = parseFloat(overdueResult?.totalOverdue) || 0;

    // Get recent sales for monthly data (simplified approach)
    const recentSales = await models.Sale.findAll({
      attributes: ['id', 'date', 'total'],
      order: [['date', 'ASC']],
      limit: 100, // Get recent sales for chart
      raw: true
    });

    // Generate monthly revenue data (simplified)
    const monthlyData = {};
    recentSales.forEach(sale => {
      if (sale.date) {
        const date = new Date(sale.date);
        const month = date.toLocaleString('default', { month: 'short' });
        
        if (!monthlyData[month]) {
          monthlyData[month] = { revenue: 0, orders: 0 };
        }
        
        monthlyData[month].revenue += parseFloat(sale.total || 0);
        monthlyData[month].orders += 1;
      }
    });

    // Convert to array format
    const revenueData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      orders: data.orders
    }));

    // Get top selling products for distribution chart
    const topProducts = await models.OrderItem.findAll({
      attributes: [
        'product_id',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold'],
        [sequelize.fn('SUM', sequelize.col('subtotal')), 'totalRevenue']
      ],
      group: ['product_id'],
      order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
      limit: 5,
      raw: true
    });

    // Get product names for the top products
    const productIds = topProducts.map(item => item.product_id);
    const products = await models.Product.findAll({
      where: { id: productIds },
      attributes: ['id', 'name'],
      raw: true
    });

    // Create product map for quick lookup
    const productMap = {};
    products.forEach(product => {
      productMap[product.id] = product.name;
    });

    // Format sales distribution data
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const salesDistribution = topProducts.map((item, index) => ({
      category: productMap[item.product_id] || `Product ${item.product_id}`,
      value: parseFloat(item.totalRevenue) || 0,
      color: colors[index % colors.length]
    }));

    // Prepare response data
    const stats = {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts
    };

    const summaryCards = {
      totalAmount: totalRevenue,
      totalPaid,
      totalUnpaid,
      totalOverdue
    };

    const response = {
      stats,
      revenueData,
      salesDistribution,
      summaryCards
    };

    console.log('Dashboard data fetched successfully');
    res.json(response);

  } catch (error) {
    console.error('GET /api/dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;