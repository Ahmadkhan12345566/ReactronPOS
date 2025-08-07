import React, { useState } from 'react';
import SalesReportList from '../components/SalesReportList';

// Dummy sales report data
const dummySalesReports = [
  {
    id: 1,
    sku: "PT008",
    dueDate: "2024-10-03",
    product: {
      name: "iPhone 14 Pro",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg",
      brand: "Apple"
    },
    category: "Phone",
    stockQty: 630,
    soldQty: 12,
    soldAmount: 6480
  },
  {
    id: 2,
    sku: "PT002",
    dueDate: "2024-12-10",
    product: {
      name: "Beats Studio Pro",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg",
      brand: "Beats"
    },
    category: "Electronics",
    stockQty: 140,
    soldQty: 10,
    soldAmount: 1600
  },
  {
    id: 3,
    sku: "PT010",
    dueDate: "2024-09-10",
    product: {
      name: "Borealis Backpack",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg",
      brand: "The North Face"
    },
    category: "Bags",
    stockQty: 550,
    soldQty: 20,
    soldAmount: 900
  },
  {
    id: 4,
    sku: "PT007",
    dueDate: "2024-10-14",
    product: {
      name: "Red Premium Satchel",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg",
      brand: "Dior"
    },
    category: "Bags",
    stockQty: 700,
    soldQty: 15,
    soldAmount: 900
  },
  {
    id: 5,
    sku: "PT004",
    dueDate: "2024-11-18",
    product: {
      name: "Apple Series 5 Watch",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg",
      brand: "Apple"
    },
    category: "Electronics",
    stockQty: 450,
    soldQty: 10,
    soldAmount: 1200
  },
  {
    id: 6,
    sku: "PT005",
    dueDate: "2024-11-18",
    product: {
      name: "Amazon Echo Dot",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg",
      brand: "Amazon"
    },
    category: "Electronics",
    stockQty: 320,
    soldQty: 5,
    soldAmount: 400
  },
  {
    id: 7,
    sku: "PT009",
    dueDate: "2024-09-20",
    product: {
      name: "Gaming Chair",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg",
      brand: "Arlime"
    },
    category: "Furniture",
    stockQty: 410,
    soldQty: 10,
    soldAmount: 2000
  },
  {
    id: 8,
    sku: "PT001",
    dueDate: "2024-12-24",
    product: {
      name: "Lenovo IdeaPad 3",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg",
      brand: "Lenovo"
    },
    category: "Computers",
    stockQty: 100,
    soldQty: 5,
    soldAmount: 3000
  },
  {
    id: 9,
    sku: "PT006",
    dueDate: "2024-10-25",
    product: {
      name: "Sanford Chair Sofa",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg",
      brand: "Modern Wave"
    },
    category: "Furniture",
    stockQty: 650,
    soldQty: 7,
    soldAmount: 2240
  },
  {
    id: 10,
    sku: "PT003",
    dueDate: "2024-11-27",
    product: {
      name: "Nike Jordan",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg",
      brand: "Nike"
    },
    category: "Shoe",
    stockQty: 300,
    soldQty: 8,
    soldAmount: 880
  }
];

export default function SalesReport() {
  const [reports] = useState(dummySalesReports);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <SalesReportList reports={reports} />
    </div>
  );
}