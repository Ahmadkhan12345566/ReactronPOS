import React, { useState } from 'react';
import BrandList from '../components/BrandList';

export const dummyBrands = [
  {
    id: 1,
    name: 'Lenovo',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Lenovo_logo_2015.svg',
    createdOn: '24 Dec 2024',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Beats',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Beats_Electronics_logo.svg',
    createdOn: '10 Dec 2024',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Nike',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
    createdOn: '27 Nov 2024',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Apple',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    createdOn: '18 Nov 2024',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Amazon',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    createdOn: '06 Nov 2024',
    status: 'Active'
  },
  {
    id: 6,
    name: 'Woodmart',
    image: 'https://woodmart.xtemos.com/wp-content/uploads/2017/01/logo-white.png',
    createdOn: '25 Oct 2024',
    status: 'Active'
  },
  {
    id: 7,
    name: 'Dior',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Christian_Dior_Logo.svg',
    createdOn: '14 Oct 2024',
    status: 'Active'
  },
  {
    id: 8,
    name: 'Lava',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Lava_International_logo.svg',
    createdOn: '03 Oct 2024',
    status: 'Active'
  },
  {
    id: 9,
    name: 'Nilkamal',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/44/Nilkamal_Logo.png',
    createdOn: '20 Sep 2024',
    status: 'Active'
  },
  {
    id: 10,
    name: 'The North Face',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/94/The_North_Face_logo.svg',
    createdOn: '10 Sep 2024',
    status: 'Active'
  }
];

export default function Brands() {
  const [brands] = useState(dummyBrands);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <BrandList brands={brands} setShowForm={setShowForm} />
      {/* We'll add the AddBrand modal here later */}
    </div>
  );
}