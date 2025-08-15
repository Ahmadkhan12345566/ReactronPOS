import React from 'react';
import { NavLink, Routes, Route, useLocation } from 'react-router-dom';
import CustomerDueReportList from '../components/lists/CustomerDueReportList';

export const dummyCustomerDueReports = [
  {
    id: 1,
    reference: "INV2011",
    code: "CU006",
    customer: {
      name: "Marsha Betts",
      image: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    totalAmount: 2000,
    paid: 2000,
    due: 0,
    status: "Paid"
  },
  {
    id: 2,
    reference: "INV2012",
    code: "CU007",
    customer: {
      name: "Daniel Foster",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    totalAmount: 1500,
    paid: 800,
    due: 700,
    status: "Partial"
  },
  {
    id: 3,
    reference: "INV2013",
    code: "CU008",
    customer: {
      name: "Aisha Patel",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    totalAmount: 3000,
    paid: 0,
    due: 3000,
    status: "Overdue"
  },
  {
    id: 4,
    reference: "INV2014",
    code: "CU009",
    customer: {
      name: "Javier Morales",
      image: "https://randomuser.me/api/portraits/men/76.jpg"
    },
    totalAmount: 2500,
    paid: 2500,
    due: 0,
    status: "Paid"
  },
  {
    id: 5,
    reference: "INV2015",
    code: "CU010",
    customer: {
      name: "Lin Wang",
      image: "https://randomuser.me/api/portraits/women/56.jpg"
    },
    totalAmount: 1200,
    paid: 1200,
    due: 0,
    status: "Paid"
  },
  {
    id: 6,
    reference: "INV2016",
    code: "CU011",
    customer: {
      name: "Oleg Petrov",
      image: "https://randomuser.me/api/portraits/men/18.jpg"
    },
    totalAmount: 1900,
    paid: 1000,
    due: 900,
    status: "Partial"
  },
  {
    id: 7,
    reference: "INV2017",
    code: "CU012",
    customer: {
      name: "Elena Rossi",
      image: "https://randomuser.me/api/portraits/women/22.jpg"
    },
    totalAmount: 2200,
    paid: 0,
    due: 2200,
    status: "Overdue"
  },
  {
    id: 8,
    reference: "INV2018",
    code: "CU013",
    customer: {
      name: "Marcus Johansson",
      image: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    totalAmount: 800,
    paid: 800,
    due: 0,
    status: "Paid"
  },
  {
    id: 9,
    reference: "INV2019",
    code: "CU014",
    customer: {
      name: "Fatima Zahir",
      image: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    totalAmount: 1600,
    paid: 600,
    due: 1000,
    status: "Partial"
  },
  {
    id: 10,
    reference: "INV2020",
    code: "CU015",
    customer: {
      name: "David Smith",
      image: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    totalAmount: 500,
    paid: 0,
    due: 500,
    status: "Overdue"
  }
];


export default function CustomerDueReport() {
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
        <CustomerDueReportList reports={dummyCustomerDueReports} isDueReport={false} />
    </div>
  );
}
