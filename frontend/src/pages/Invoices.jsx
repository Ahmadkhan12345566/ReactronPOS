import React, { useState } from 'react';
import InvoiceList from '../components/InvoiceList';

// Dummy invoice data
export const dummyInvoices = [
  {
    id: 1,
    invoiceNo: 'INV001',
    customer: { 
      name: 'Carl Evans', 
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg' 
    },
    dueDate: '24 Dec 2024',
    amount: 1000,
    paid: 1000,
    amountDue: 0,
    status: 'Paid'
  },
  {
    id: 2,
    invoiceNo: 'INV002',
    customer: { 
      name: 'Minerva Rameriz', 
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg' 
    },
    dueDate: '24 Dec 2024',
    amount: 1500,
    paid: 0,
    amountDue: 1500,
    status: 'Unpaid'
  },
  {
    id: 3,
    invoiceNo: 'INV003',
    customer: { 
      name: 'Robert Lamon', 
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg' 
    },
    dueDate: '24 Dec 2024',
    amount: 1500,
    paid: 0,
    amountDue: 1500,
    status: 'Unpaid'
  },
  {
    id: 4,
    invoiceNo: 'INV004',
    customer: { 
      name: 'Patricia Lewis', 
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg' 
    },
    dueDate: '24 Dec 2024',
    amount: 2000,
    paid: 1000,
    amountDue: 1000,
    status: 'Overdue'
  },
  {
    id: 5,
    invoiceNo: 'INV005',
    customer: { 
      name: 'Mark Joslyn', 
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg' 
    },
    dueDate: '24 Dec 2024',
    amount: 800,
    paid: 800,
    amountDue: 0,
    status: 'Paid'
  },
  {
    id: 6,
    invoiceNo: 'INV006',
    customer: { 
      name: 'Marsha Betts', 
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg' 
    },
    dueDate: '24 Dec 2024',
    amount: 750,
    paid: 0,
    amountDue: 750,
    status: 'Unpaid'
  },
  {
    id: 7,
    invoiceNo: 'INV007',
    customer: { 
      name: 'Daniel Jude', 
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg' 
    },
    dueDate: '24 Dec 2024',
    amount: 1300,
    paid: 1300,
    amountDue: 0,
    status: 'Paid'
  },
  {
    id: 8,
    invoiceNo: 'INV008',
    customer: { 
      name: 'Emma Bates', 
      avatar: 'https://randomuser.me/api/portraits/women/8.jpg' 
    },
    dueDate: '24 Dec 2024',
    amount: 1100,
    paid: 1100,
    amountDue: 0,
    status: 'Paid'
  },
  {
    id: 9,
    invoiceNo: 'INV009',
    customer: { 
      name: 'Richard Fralick', 
      avatar: 'https://randomuser.me/api/portraits/men/9.jpg' 
    },
    dueDate: '24 Dec 2024',
    amount: 2300,
    paid: 2300,
    amountDue: 0,
    status: 'Paid'
  },
  {
    id: 10,
    invoiceNo: 'INV010',
    customer: { 
      name: 'Michelle Robison', 
      avatar: 'https://randomuser.me/api/portraits/women/10.jpg' 
    },
    dueDate: '24 Dec 2024',
    amount: 1700,
    paid: 1700,
    amountDue: 0,
    status: 'Paid'
  }
];

export default function Invoices() {
  const [invoices] = useState(dummyInvoices);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <InvoiceList invoices={invoices} />
    </div>
  );
}