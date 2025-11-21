// frontend/src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { api } from '../services/api'; // <-- IMPORT API
import {
  ArrowPathIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { Bar, Pie } from 'react-chartjs-2'; // You may need to: npm install chart.js react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Helper to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PKR',
  }).format(value || 0);
};

// --- REMOVED ALL DUMMY DATA ---

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('revenue'); // 'revenue' or 'orders'

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardData = await api.get('/api/dashboard');
        setData(dashboardData);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- REBUILT STATS AND CHARTS FROM API DATA ---

  // Create stats cards from API data
  const statsCards = data ? [
    {
      title: "Total Revenue",
      value: formatCurrency(data.stats.totalRevenue),
      icon: CurrencyDollarIcon,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Total Orders",
      value: data.stats.totalOrders.toLocaleString(),
      icon: ShoppingBagIcon,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Total Customers",
      value: data.stats.totalCustomers.toLocaleString(),
      icon: UserGroupIcon,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Total Products",
      value: data.stats.totalProducts.toLocaleString(),
      icon: CubeIcon,
      color: "bg-amber-100 text-amber-600"
    }
  ] : [];

  // Create summary cards from API data
  const summaryCards = data ? [
    { title: 'Total Amount', value: formatCurrency(data.summaryCards.totalAmount) },
    { title: 'Total Paid', value: formatCurrency(data.summaryCards.totalPaid) },
    { title: 'Total Unpaid', value: formatCurrency(data.summaryCards.totalUnpaid) },
    { title: 'Total Overdue', value: formatCurrency(data.summaryCards.totalOverdue) }
  ] : [];

  // Bar Chart Data
  const barChartData = {
    labels: data?.revenueData.map(d => d.month) || [],
    datasets: [
      {
        label: activeChart === 'revenue' ? 'Revenue' : 'Orders',
        data: data?.revenueData.map(d => d[activeChart]) || [],
        backgroundColor: 'rgba(29, 78, 216, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += activeChart === 'revenue' ? formatCurrency(context.parsed.y) : context.parsed.y;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => activeChart === 'revenue' ? formatCurrency(value) : value
        }
      },
    },
  };

  // Pie Chart Data
  const pieChartData = {
    labels: data?.salesDistribution.map(d => d.category) || [],
    datasets: [
      {
        data: data?.salesDistribution.map(d => d.value) || [],
        backgroundColor: data?.salesDistribution.map(d => d.color) || [],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += formatCurrency(context.parsed);
            }
            return label;
          }
        }
      }
    },
  };

  // --- RENDER LOGIC ---

  if (loading) {
    return <div className="p-6">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {data?.currentUser || 'Admin'}</p>
        </div>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <ArrowPathIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-300 shadow-sm p-6 flex items-center gap-6">
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-300 shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-300 shadow-sm p-6 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${activeChart === 'revenue' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setActiveChart('revenue')}
              >
                Revenue
              </button>
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${activeChart === 'orders' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setActiveChart('orders')}
              >
                Orders
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Sales Distribution */}
        <div className="bg-white rounded-2xl border border-gray-300 shadow-sm p-6 flex flex-col min-h-[400px]">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Sales Distribution</h2>
          <div className="flex-1 min-h-0">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}