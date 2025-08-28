import React, { useState } from 'react';
import {
  ArrowPathIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';

// Dummy data for dashboard cards
const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    icon: CurrencyDollarIcon,
    color: "bg-green-100 text-green-600"
  },
  {
    title: "Total Orders",
    value: "1,235",
    change: "+12.3% from last month",
    icon: ShoppingBagIcon,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Total Customers",
    value: "1,582",
    change: "+18.4% from last month",
    icon: UserGroupIcon,
    color: "bg-purple-100 text-purple-600"
  },
  {
    title: "Total Products",
    value: "324",
    change: "+5.2% from last month",
    icon: CubeIcon,
    color: "bg-amber-100 text-amber-600"
  }
];

// Revenue data for bar chart
const revenueData = [
  { month: 'Jan', revenue: 4000, orders: 120 },
  { month: 'Feb', revenue: 3000, orders: 98 },
  { month: 'Mar', revenue: 5000, orders: 150 },
  { month: 'Apr', revenue: 2780, orders: 110 },
  { month: 'May', revenue: 1890, orders: 85 },
  { month: 'Jun', revenue: 2390, orders: 105 },
  { month: 'Jul', revenue: 3490, orders: 130 },
  { month: 'Aug', revenue: 4200, orders: 145 },
  { month: 'Sep', revenue: 3800, orders: 125 },
  { month: 'Oct', revenue: 4500, orders: 160 },
  { month: 'Nov', revenue: 5200, orders: 180 },
  { month: 'Dec', revenue: 6100, orders: 200 },
];

// Sales distribution data for pie chart
const salesDistribution = [
  { category: 'Food', value: 45, color: '#4F46E5' },
  { category: 'Cold Drinks', value: 25, color: '#10B981' },
  { category: 'Hot Drinks', value: 30, color: '#F59E0B' },
];

const Dashboard = () => {
  // Chart data
  const [activeChart, setActiveChart] = useState('revenue');
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  // Function to render bar chart
  const renderBarChart = () => {
    const maxValue = Math.max(...revenueData.map(d => activeChart === 'revenue' ? d.revenue : d.orders));
    
    return (
      <div className="flex flex-col h-full">
        <div className="flex-grow flex items-end justify-between px-4 gap-0.5">
          {revenueData.map((data, index) => {
            const value = activeChart === 'revenue' ? data.revenue : data.orders;
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
            
            return (
              <div key={index} className="flex flex-col items-center h-full flex-1">
                <div className="flex flex-col items-center justify-end h-full w-full max-w-[32px] md:max-w-[32px]">
                  <div 
                    className={`w-full rounded-t-md ${activeChart === 'revenue' ? 'bg-blue-500' : 'bg-green-500'}`}
                    style={{ 
                      height: `${height}%`,
                      minHeight: '2px'
                    }}
                  >
                    <div className="text-white text-xs font-semibold text-center mt-1">
                      {activeChart === 'revenue' ? `$${value}` : value}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">{data.month}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Function to render pie chart
  const renderPieChart = () => {
    const total = salesDistribution.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;
    const size = 200;
    const center = size / 2;
    const radius = center - 10;
    
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="max-h-[200px]">
          {salesDistribution.map((item, index) => {
            const sliceAngle = (item.value / total) * 360;
            const endAngle = startAngle + sliceAngle;
            
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;
            
            const x1 = center + radius * Math.cos(startAngleRad);
            const y1 = center + radius * Math.sin(startAngleRad);
            const x2 = center + radius * Math.cos(endAngleRad);
            const y2 = center + radius * Math.sin(endAngleRad);
            
            const largeArcFlag = sliceAngle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${center} ${center}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            startAngle = endAngle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                stroke="white"
                strokeWidth="1"
              />
            );
          })}
        </svg>
        
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {salesDistribution.map((item, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-4 h-4 mr-2 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm">
                {item.category} ({((item.value / total) * 100).toFixed(0)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 ">Welcome back, {user?.name || "admin"}!</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50">
          <ArrowPathIcon className="w-5 h-5 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl border border-gray-300 shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</h3>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-gray-300 shadow-sm p-6 flex flex-col">
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
            {renderBarChart()}
          </div>
        </div>

        {/* Sales Distribution */}
        <div className="bg-white rounded-2xl border border-gray-300 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Sales Distribution</h2>
          <div className="flex-1 min-h-0">
            {renderPieChart()}
          </div>
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-6"></div>
    </div>
  );
};

export default Dashboard;