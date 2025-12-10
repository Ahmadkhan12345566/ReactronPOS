// frontend/src/pages/CustomerDueReport.jsx

import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import CustomerDueReportList from '../components/lists/CustomerDueReportList';
import { api } from '../services/api'; // <-- IMPORT API

// --- REMOVED DUMMY DATA ---

export default function CustomerDueReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // The /api/invoices route has the due data we need
        const invoiceData = await api.get('/api/invoices');
        
        // Filter for only invoices that have an amount due
        const dueInvoices = invoiceData
          .filter(invoice => invoice.amountDue > 0)
          .map(invoice => ({ // Map to the structure expected by the list
            id: invoice.id,
            reference: invoice.invoiceNo,
            code: invoice.customer.id, // Assuming customer ID is the code
            customer: invoice.customer,
            totalAmount: invoice.amount,
            paid: invoice.paid,
            due: invoice.amountDue,
            status: invoice.status
          }));
        
        setReports(dueInvoices);
      } catch (err) {
        setError(err.message || 'Failed to fetch customer due reports');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const location = useLocation();
  const isDue = location.pathname.endsWith('/due');

  const pageTitle = isDue ? 'Customer Due Report' : 'Customer Report';
  const pageDescription = isDue
    ? 'View outstanding dues for customers'
    : 'Manage your customer reports';

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      {/* Navigation Tabs */}
      <div className="mb-6 border-b">
        <ul className="flex">
          <li className="mr-2">
            <NavLink
              to="/customers/report"
              end
              className={({ isActive }) =>
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
              className={({ isActive }) =>
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
      <CustomerDueReportList 
        reports={reports} 
        loading={loading}
        error={error}
      />
    </div>
  );
}