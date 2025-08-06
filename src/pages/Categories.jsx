import React, { useState } from 'react';
import CategoryList from '../components/CategoryList';

// Dummy categories data
export const dummyCategories = [
  { id: 1, name: 'Computers', slug: 'computers', createdOn: '24 Dec 2024', status: 'Active' },
  { id: 2, name: 'Electronics', slug: 'electronics', createdOn: '10 Dec 2024', status: 'Active' },
  { id: 3, name: 'Shoe', slug: 'shoe', createdOn: '27 Nov 2024', status: 'Active' },
  { id: 4, name: 'Cosmetics', slug: 'cosmetics', createdOn: '18 Nov 2024', status: 'Active' },
  { id: 5, name: 'Groceries', slug: 'groceries', createdOn: '06 Nov 2024', status: 'Active' },
  { id: 6, name: 'Furniture', slug: 'furniture', createdOn: '25 Oct 2024', status: 'Active' },
  { id: 7, name: 'Bags', slug: 'bags', createdOn: '14 Oct 2024', status: 'Active' },
  { id: 8, name: 'Phone', slug: 'phone', createdOn: '03 Oct 2024', status: 'Active' },
  { id: 9, name: 'Appliances', slug: 'appliances', createdOn: '20 Sep 2024', status: 'Active' },
  { id: 10, name: 'Clothing', slug: 'clothing', createdOn: '10 Sep 2024', status: 'Active' },
];

export default function Categories() {
  const [categories] = useState(dummyCategories);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <CategoryList categories={categories} setShowForm={setShowForm} />
      {/* We'll add the AddCategory modal here later */}
    </div>
  );
}