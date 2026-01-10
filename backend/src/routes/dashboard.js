import express from 'express';
import { Sale, Customer, Product, OrderItem } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const totalOrders = await Sale.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalProducts = await Product.countDocuments();

    const totalRevenueResult = await Sale.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

    const paidResult = await Sale.aggregate([
      { $match: { payment_status: 'Paid' } },
      { $group: { _id: null, totalPaid: { $sum: '$paid' } } }
    ]);
    const totalPaid = paidResult.length > 0 ? paidResult[0].totalPaid : 0;

    const unpaidResult = await Sale.aggregate([
      { $match: { payment_status: 'Unpaid' } },
      { $group: { _id: null, totalUnpaid: { $sum: '$due' } } }
    ]);
    const totalUnpaid = unpaidResult.length > 0 ? unpaidResult[0].totalUnpaid : 0;

    const overdueResult = await Sale.aggregate([
      { $match: { payment_status: 'Overdue' } },
      { $group: { _id: null, totalOverdue: { $sum: '$due' } } }
    ]);
    const totalOverdue = overdueResult.length > 0 ? overdueResult[0].totalOverdue : 0;

    const recentSales = await Sale.find({}, 'date total').sort({ date: 'asc' }).limit(100).lean();

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

    const topProducts = await OrderItem.aggregate([
      {
        $group: {
          _id: '$product',
          totalRevenue: { $sum: '$subtotal' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $unwind: '$productInfo'
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          category: '$productInfo.name',
          value: '$totalRevenue',
          _id: 0
        }
      }
    ]);

    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const salesDistribution = topProducts.map((item, index) => ({
      ...item,
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
