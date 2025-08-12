import React, { useState } from 'react';
import { NavLink, Routes, Route, useLocation } from 'react-router-dom';
import CustomerReportList from '../components/CustomerReportList';
import CustomerDueReportList from '../components/CustomerDueReportList';

// Dummy data for Customer Report
const dummyCustomerReports = [
  {
    id: 1,
    reference: "INV2011",
    code: "CU006",
    customer: {
      name: "Marsha Betts",
      image: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    totalOrders: 45,
    amount: 750,
    paymentMethod: "Cash",
    status: "Completed"
  },
  {
    id: 2,
    reference: "INV2014",
    code: "CU007",
    customer: {
      name: "Daniel Jude",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    totalOrders: 21,
    amount: 1300,
    paymentMethod: "Credit Card",
    status: "Completed"
  },
  {
    id: 3,
    reference: "INV2025",
    code: "CU001",
    customer: {
      name: "Carl Evans",
      image: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    totalOrders: 10,
    amount: 1000,
    paymentMethod: "Cash",
    status: "Completed"
  },
  {
    id: 4,
    reference: "INV2031",
    code: "CU002",
    customer: {
      name: "Minerva Rameriz",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    totalOrders: 15,
    amount: 1500,
    paymentMethod: "Paypal",
    status: "Completed"
  },
  {
    id: 5,
    reference: "INV2033",
    code: "CU004",
    customer: {
      name: "Patricia Lewis",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    totalOrders: 14,
    amount: 2000,
    paymentMethod: "Stripe",
    status: "Completed"
  },
  {
    id: 6,
    reference: "INV2042",
    code: "CU003",
    customer: {
      name: "Robert Lamon",
      image: "https://randomuser.me/api/portraits/men/41.jpg"
    },
    totalOrders: 22,
    amount: 1500,
    paymentMethod: "Paypal",
    status: "Completed"
  },
  {
    id: 7,
    reference: "INV2042",
    code: "CU005",
    customer: {
      name: "Mark Joslyn",
      image: "https://randomuser.me/api/portraits/men/89.jpg"
    },
    totalOrders: 12,
    amount: 800,
    paymentMethod: "Paypal",
    status: "Completed"
  },
  {
    id: 8,
    reference: "INV2047",
    code: "CU009",
    customer: {
      name: "Richard Fralick",
      image: "https://randomuser.me/api/portraits/men/91.jpg"
    },
    totalOrders: 15,
    amount: 1700,
    paymentMethod: "Credit Card",
    status: "Completed"
  },
  {
    id: 9,
    reference: "INV2056",
    code: "CU008",
    customer: {
      name: "Emma Bates",
      image: "https://randomuser.me/api/portraits/women/29.jpg"
    },
    totalOrders: 78,
    amount: 1100,
    paymentMethod: "Stripe",
    status: "Completed"
  }
];

export default function CustomerReport() {
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

      

      {/* Conditional rendering based on route */}
            <CustomerReportList 
              reports={dummyCustomerReports} 
              isDueReport={false}
            />
    </div>
  );
}