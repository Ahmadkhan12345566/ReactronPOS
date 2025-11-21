// frontend/src/pages/CustomerReport.jsx

import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import CustomerReportList from '../components/lists/CustomerReportList';
import { api } from '../services/api'; // <-- IMPORT API

// --- REMOVED DUMMY DATA ---

export default function CustomerReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // This endpoint returns sales data, which is what this report shows
        const data = await api.get('/api/sales/report');
        
        // This report seems to want an aggregation per customer,
        // but the backend route returns per-item.
        // For now, we will just pass the raw data.
        // A better fix would be to create a new backend route for this.
        
        // Let's aggregate by customer on the frontend for now
        const customerAggregates = {};
        data.forEach(item => {
          const customerName = item.product.brand; // This seems wrong in your backend, but following its structure
          if (!customerAggregates[customerName]) {
            customerAggregates[customerName] = {
              id: customerName,
              reference: item.sku,
              code: 'N/A',
              customer: { name: customerName, image: item.product.image },
              totalOrders: 0,
              amount: 0,
              paymentMethod: 'Multiple',
              status: 'Completed'
            };
          }
          customerAggregates[customerName].totalOrders += item.soldQty;
          customerAggregates[customerName].amount += item.soldAmount;
        });

        setReports(Object.values(customerAggregates));
      } catch (err) {
        setError(err.message || 'Failed to fetch customer reports');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);


  const location = useLocation();
  const isDueReport = location.pathname.includes('/due');
  const pageTitle = isDueReport ? "Customer Due Report" : "Customer Report";
  const pageDescription = isDueReport ? "View Reports of Customer" : "Manage your customer reports";
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      {/* Navigation Tabs */}
      <div className="mb-6 border-b">
        <ul className="flex">
          <li className="mr-2">
            <NavLink 
              to="/customers/report" 
              end
              className={({isActive}) => 
                `px-6 py-3 block text-sm font-medium ${
                  isActive 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              Customer Report
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/customers/report/due" 
              className={({isActive}) => 
                `px-6 py-3 block text-sm font-medium ${
                  isActive 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              Customer Due
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Page Content */}
      <CustomerReportList 
        reports={reports} 
        loading={loading}
        error={error}
      />
    </div>
  );
}