import React, { useState } from 'react';
import SalesList from '../components/SalesList';

// Dummy sales data
export const dummySales = [
  {
    id: 1,
    customer: { 
      name: 'Carl Evans', 
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg' 
    },
    reference: 'SL001',
    date: '24 Dec 2024',
    status: 'Completed',
    grandTotal: 1000,
    paid: 1000,
    due: 0,
    paymentStatus: 'Paid',
    biller: 'Admin'
  },
  {
    id: 2,
    customer: { 
      name: 'Minerva Rameriz', 
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg' 
    },
    reference: 'SL002',
    date: '10 Dec 2024',
    status: 'Pending',
    grandTotal: 1500,
    paid: 0,
    due: 1500,
    paymentStatus: 'Unpaid',
    biller: 'Admin'
  },
  {
    id: 3,
    customer: { 
      name: 'Robert Lamon', 
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg' 
    },
    reference: 'SL003',
    date: '27 Nov 2024',
    status: 'Completed',
    grandTotal: 800,
    paid: 800,
    due: 0,
    paymentStatus: 'Paid',
    biller: 'Admin'
  },
  {
    id: 4,
    customer: { 
      name: 'Patricia Lewis', 
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg' 
    },
    reference: 'SL004',
    date: '18 Nov 2024',
    status: 'Completed',
    grandTotal: 2000,
    paid: 1000,
    due: 1000,
    paymentStatus: 'Overdue',
    biller: 'Admin'
  },
  {
    id: 5,
    customer: { 
      name: 'Mark Joslyn', 
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg' 
    },
    reference: 'SL005',
    date: '06 Nov 2024',
    status: 'Completed',
    grandTotal: 1300,
    paid: 1300,
    due: 0,
    paymentStatus: 'Paid',
    biller: 'Admin'
  },
  {
    id: 6,
    customer: { 
      name: 'Marsha Betts', 
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg' 
    },
    reference: 'SL006',
    date: '25 Oct 2024',
    status: 'Pending',
    grandTotal: 750,
    paid: 0,
    due: 750,
    paymentStatus: 'Unpaid',
    biller: 'Admin'
  },
  {
    id: 7,
    customer: { 
      name: 'Daniel Jude', 
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg' 
    },
    reference: 'SL007',
    date: '14 Oct 2024',
    status: 'Completed',
    grandTotal: 1700,
    paid: 1700,
    due: 0,
    paymentStatus: 'Paid',
    biller: 'Admin'
  },
  {
    id: 8,
    customer: { 
      name: 'Emma Bates', 
      avatar: 'https://randomuser.me/api/portraits/women/8.jpg' 
    },
    reference: 'SL008',
    date: '03 Oct 2024',
    status: 'Completed',
    grandTotal: 900,
    paid: 900,
    due: 0,
    paymentStatus: 'Paid',
    biller: 'Admin'
  },
  {
    id: 9,
    customer: { 
      name: 'Richard Fralick', 
      avatar: 'https://randomuser.me/api/portraits/men/9.jpg' 
    },
    reference: 'SL009',
    date: '20 Sep 2024',
    status: 'Pending',
    grandTotal: 2300,
    paid: 2300,
    due: 0,
    paymentStatus: 'Paid',
    biller: 'Admin'
  },
  {
    id: 10,
    customer: { 
      name: 'Michelle Robison', 
      avatar: 'https://randomuser.me/api/portraits/women/10.jpg' 
    },
    reference: 'SL010',
    date: '10 Sep 2024',
    status: 'Pending',
    grandTotal: 1700,
    paid: 1700,
    due: 0,
    paymentStatus: 'Paid',
    biller: 'Admin'
  }
];

// Dummy sales data (same as before)

export default function Sales() {
  const [sales] = useState(dummySales);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <SalesList sales={sales} setShowForm={setShowForm} />
      </div>
      {/* We'll add the AddSales modal here later */}
    </div>
  );
}