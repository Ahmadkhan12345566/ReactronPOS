import React, { useState } from 'react';
import SupplierList from '../components/lists/SupplierList';

export const dummySuppliers = [
  {
    id: 1,
    code: 'SUP001',
    name: 'Carl Evans',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    email: 'carl.evans@example.com',
    phone: '+1234567890',
    address: '123 Main St',
    products: 'Electronics, Furniture',
    status: 'Active'
  },
  {
    id: 2,
    code: 'SUP002',
    name: 'Alice Murray',
    avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
    email: 'alice.murray@example.com',
    phone: '+1234567891',
    address: '456 Oak Avenue',
    products: 'Office Supplies, Stationery',
    status: 'Active'
  },
  {
    id: 3,
    code: 'SUP003',
    name: 'Lucien Aubert',
    avatar: 'https://randomuser.me/api/portraits/men/81.jpg',
    email: 'lucien.aubert@example.com',
    phone: '+1234567892',
    address: '789 Pine Road',
    products: 'Electronics, Cables',
    status: 'Active'
  },
  {
    id: 4,
    code: 'SUP004',
    name: 'Flavie Roche',
    avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
    email: 'flavie.roche@example.com',
    phone: '+1234567893',
    address: '101 Maple Lane',
    products: 'Cleaning Supplies, Fixtures',
    status: 'Active'
  },
  {
    id: 5,
    code: 'SUP005',
    name: 'Melvin Faure',
    avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
    email: 'melvin.faure@example.com',
    phone: '+1234567894',
    address: '202 Cedar Blvd',
    products: 'Furniture, Carpets',
    status: 'Inactive'
  },
  {
    id: 6,
    code: 'SUP006',
    name: 'Axelle Roger',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    email: 'axelle.roger@example.com',
    phone: '+1234567895',
    address: '303 Birch Street',
    products: 'Office Supplies, Decor',
    status: 'Active'
  },
  {
    id: 7,
    code: 'SUP007',
    name: 'Alexandra Leclercq',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    email: 'alexandra.leclercq@example.com',
    phone: '+1234567896',
    address: '404 Elm Drive',
    products: 'Electronics, Gadgets',
    status: 'Active'
  },
  {
    id: 8,
    code: 'SUP008',
    name: 'Romane da Silva',
    avatar: 'https://randomuser.me/api/portraits/women/77.jpg',
    email: 'romane.dasilva@example.com',
    phone: '+1234567897',
    address: '505 Spruce Ave',
    products: 'Cleaning Supplies',
    status: 'Active'
  },
  {
    id: 9,
    code: 'SUP009',
    name: 'Lucy Petit',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    email: 'lucy.petit@example.com',
    phone: '+1234567898',
    address: '606 Willow Court',
    products: 'Furniture',
    status: 'Active'
  },
  {
    id: 10,
    code: 'SUP010',
    name: 'Rayan Michel',
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    email: 'rayan.michel@example.com',
    phone: '+1234567899',
    address: '707 Cherry Street',
    products: 'Electronics, Software',
    status: 'Active'
  }
];


export default function Suppliers() {
  const [Suppliers] = useState(dummySuppliers);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <SupplierList Suppliers={Suppliers} setShowForm={setShowForm} />
    </div>
  );
}