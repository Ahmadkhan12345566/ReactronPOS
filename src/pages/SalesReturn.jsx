import React, { useState } from 'react';
import SalesReturnList from '../components/SalesReturnList';

// Dummy sales return data
export const dummySalesReturns = [
  {
    id: 1,
    product: { 
      name: 'Lenovo IdeaPad 3', 
      image: '/src/assets/img/beef-burger.png' 
    },
    date: '19 Nov 2022',
    customer: { 
      name: 'Carl Evans', 
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg' 
    },
    status: 'Received',
    total: 1000,
    paid: 1000,
    due: 0,
    paymentStatus: 'Paid'
  },
  {
    id: 2,
    product: { 
      name: 'Apple tablet', 
      image: '/src/assets/img/products/pos-product-10.svg' 
    },
    date: '19 Nov 2022',
    customer: { 
      name: 'Minerva Rameriz', 
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg' 
    },
    status: 'Pending',
    total: 1500,
    paid: 0,
    due: 1500,
    paymentStatus: 'Unpaid'
  },
  {
    id: 3,
    product: { 
      name: 'Headphone', 
      image: '/src/assets/img/products/product-02.jpg' 
    },
    date: '19 Nov 2022',
    customer: { 
      name: 'Robert Lamon', 
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg' 
    },
    status: 'Received',
    total: 2000,
    paid: 1000,
    due: 1000,
    paymentStatus: 'Overdue'
  },
  {
    id: 4,
    product: { 
      name: 'Nike Jordan', 
      image: '/src/assets/img/products/stock-img-02.png' 
    },
    date: '19 Nov 2022',
    customer: { 
      name: 'Mark Joslyn', 
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg' 
    },
    status: 'Received',
    total: 1500,
    paid: 1500,
    due: 0,
    paymentStatus: 'Paid'
  },
  {
    id: 5,
    product: { 
      name: 'Macbook Pro', 
      image: '/src/assets/img/products/product6.jpg' 
    },
    date: '19 Nov 2022',
    customer: { 
      name: 'Patricia Lewis', 
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg' 
    },
    status: 'Received',
    total: 800,
    paid: 800,
    due: 0,
    paymentStatus: 'Paid'
  },
  {
    id: 6,
    product: { 
      name: 'Red Premium Satchel', 
      image: '/src/assets/img/products/expire-product-01.png' 
    },
    date: '19 Nov 2022',
    customer: { 
      name: 'Marsha Betts', 
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg' 
    },
    status: 'Pending',
    total: 750,
    paid: 0,
    due: 750,
    paymentStatus: 'Unpaid'
  },
  {
    id: 7,
    product: { 
      name: 'Apple Earpods', 
      image: '/src/assets/img/products/product7.jpg' 
    },
    date: '19 Nov 2022',
    customer: { 
      name: 'Daniel Jude', 
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg' 
    },
    status: 'Received',
    total: 1300,
    paid: 1300,
    due: 0,
    paymentStatus: 'Paid'
  },
  {
    id: 8,
    product: { 
      name: 'Iphone 14 Pro', 
      image: '/src/assets/img/products/expire-product-02.png' 
    },
    date: '19 Nov 2022',
    customer: { 
      name: 'Emma Bates', 
      avatar: 'https://randomuser.me/api/portraits/women/8.jpg' 
    },
    status: 'Received',
    total: 1100,
    paid: 1100,
    due: 0,
    paymentStatus: 'Paid'
  },
  {
    id: 9,
    product: { 
      name: 'Gaming Chair', 
      image: '/src/assets/img/products/expire-product-03.png' 
    },
    date: '19 Nov 2022',
    customer: { 
      name: 'Richard Fralick', 
      avatar: 'https://randomuser.me/api/portraits/men/9.jpg' 
    },
    status: 'Pending',
    total: 2300,
    paid: 2300,
    due: 0,
    paymentStatus: 'Paid'
  },
  {
    id: 10,
    product: { 
      name: 'Borealis Backpack', 
      image: '/src/assets/img/products/expire-product-04.png' 
    },
    date: '19 Nov 2022',
    customer: { 
      name: 'Michelle Robison', 
      avatar: 'https://randomuser.me/api/portraits/women/10.jpg' 
    },
    status: 'Pending',
    total: 1700,
    paid: 1700,
    due: 0,
    paymentStatus: 'Paid'
  }
];

export default function SalesReturn() {
  const [salesReturns] = useState(dummySalesReturns);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <SalesReturnList salesReturns={salesReturns} setShowForm={setShowForm} />
      {/* We'll add the AddSalesReturn modal here later */}
    </div>
  );
}