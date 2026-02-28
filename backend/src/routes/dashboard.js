import express from 'express';
import sequelize from '../config/database.js';
import { Sale, Customer, Product, OrderItem } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const totalOrders = await Sale.count();
    const totalCustomers = await Customer.count();
    const totalProducts = await Product.count();

    const totalRevenue = (await Sale.sum('total')) || 0;
    const totalPaid = (await Sale.sum('paid', { where: { payment_status: 'Paid' } })) || 0;
    const totalUnpaid = (await Sale.sum('due', { where: { payment_status: 'Unpaid' } })) || 0;
    const totalOverdue = (await Sale.sum('due', { where: { payment_status: 'Overdue' } })) || 0;

    const recentSales = await Sale.findAll({
      attributes: ['date', 'total'],
      order: [['date', 'ASC']],
      limit: 100,
    });

    const monthlyData = {};
    recentSales.forEach(sale => {
      if (!sale.date) return;
      const date = new Date(sale.date);
      const month = date.toLocaleString('default', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, orders: 0 };
      }
      monthlyData[month].revenue += sale.total || 0;
      monthlyData[month].orders += 1;
    });

    const revenueData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      orders: data.orders
    }));

    const topProducts = await OrderItem.findAll({
      attributes: [
        'productId',
        [sequelize.fn('SUM', sequelize.col('subtotal')), 'totalRevenue'],
      ],
      include: [{ model: Product, as: 'product', attributes: ['id', 'name'] }],
      group: ['productId', 'product.id', 'product.name'],
      order: [[sequelize.literal('totalRevenue'), 'DESC']],
      limit: 5,
    });

    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const salesDistribution = topProducts.map((item, index) => ({
      category: item.product?.name || 'Unknown',
      value: Number(item.get('totalRevenue') || 0),
      color: colors[index % colors.length]
    }));

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

    res.json({
      stats,
      revenueData,
      salesDistribution,
      summaryCards
    });
  } catch (error) {
    console.error('GET /api/dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;
