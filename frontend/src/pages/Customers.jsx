import React, { useState } from 'react';
import CustomerList from '../components/lists/CustomerList';


export const dummyCustomers = [
  {
    id: 1,
    code: 'CU001',
    name: 'Carl Evans',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    email: 'carlevans@example.com',
    phone: '+12163547758',
    country: 'Germany',
    status: 'Active'
  },
  {
    id: 2,
    code: 'CU002',
    name: 'Minerva Ramirez',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    email: 'rameriz@example.com',
    phone: '+11367529510',
    country: 'Japan',
    status: 'Active'
  },
  {
    id: 3,
    code: 'CU003',
    name: 'Ahmed Leemans',
    avatar: 'https://randomuser.me/api/portraits/men/94.jpg',
    email: 'ahmed.leemans@example.com',
    phone: '+491234567890',
    country: 'Netherlands',
    status: 'Active'
  },
  {
    id: 4,
    code: 'CU004',
    name: 'Zahra Bisschop',
    avatar: 'https://randomuser.me/api/portraits/women/96.jpg',
    email: 'zahra.bisschop@example.com',
    phone: '+319876543210',
    country: 'Netherlands',
    status: 'Active'
  },
  {
    id: 5,
    code: 'CU005',
    name: 'Roni van Willigen',
    avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
    email: 'roni.vanwilligen@example.com',
    phone: '+31491234567',
    country: 'Netherlands',
    status: 'Inactive'
  },
  {
    id: 6,
    code: 'CU006',
    name: 'Ivette van Riet',
    avatar: 'https://randomuser.me/api/portraits/women/79.jpg',
    email: 'ivette.vanriet@example.com',
    phone: '+31491239876',
    country: 'Netherlands',
    status: 'Active'
  },
  {
    id: 7,
    code: 'CU007',
    name: 'Barthold van der Biezen',
    avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
    email: 'barthold.vanderbiezen@example.com',
    phone: '+31491231234',
    country: 'Netherlands',
    status: 'Active'
  },
  {
    id: 8,
    code: 'CU008',
    name: 'Sofieke Atema',
    avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
    email: 'sofieke.atema@example.com',
    phone: '+31491239876',
    country: 'Netherlands',
    status: 'Active'
  },
  {
    id: 9,
    code: 'CU009',
    name: 'Jelle Zwanenburg',
    avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
    email: 'jelle.zwanenburg@example.com',
    phone: '+31491237654',
    country: 'Netherlands',
    status: 'Active'
  },
  {
    id: 10,
    code: 'CU010',
    name: 'Maritte Teunissen',
    avatar: 'https://randomuser.me/api/portraits/women/87.jpg',
    email: 'maritte.teunissen@example.com',
    phone: '+31491234567',
    country: 'Netherlands',
    status: 'Active'
  }
];


export default function Customers() {
  const [customers] = useState(dummyCustomers);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <CustomerList customers={customers} setShowForm={setShowForm} />
    </div>
  );
}