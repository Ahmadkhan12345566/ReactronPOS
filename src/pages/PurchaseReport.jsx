import React, { useState } from 'react';
import PurchaseReportList from '../components/PurchaseReportList';

// Dummy purchase report data
const dummyPurchaseReports = [
  {
    id: 1,
    reference: "PO2025",
    sku: "PT008",
    dueDate: "2024-10-03",
    product: {
      name: "iPhone 14 Pro",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg"
    },
    category: "Phone",
    stockQty: 630,
    purchaseQty: 12,
    purchaseAmount: 2000
  },
  {
    id: 2,
    reference: "PO2025",
    sku: "PT002",
    dueDate: "2024-12-10",
    product: {
      name: "Beats Studio Pro",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg"
    },
    category: "Electronics",
    stockQty: 140,
    purchaseQty: 10,
    purchaseAmount: 1500
  },
  {
    id: 3,
    reference: "PO2025",
    sku: "PT010",
    dueDate: "2024-09-10",
    product: {
      name: "Borealis Backpack",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg"
    },
    category: "Bags",
    stockQty: 550,
    purchaseQty: 20,
    purchaseAmount: 5000
  },
  {
    id: 4,
    reference: "PO2025",
    sku: "PT007",
    dueDate: "2024-10-14",
    product: {
      name: "Red Premium Satchel",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg"
    },
    category: "Bags",
    stockQty: 700,
    purchaseQty: 15,
    purchaseAmount: 2000
  },
  {
    id: 5,
    reference: "PO2025",
    sku: "PT004",
    dueDate: "2024-11-18",
    product: {
      name: "Apple Series 5 Watch",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg"
    },
    category: "Electronics",
    stockQty: 450,
    purchaseQty: 10,
    purchaseAmount: 1000
  },
  {
    id: 6,
    reference: "PO2025",
    sku: "PT005",
    dueDate: "2024-11-18",
    product: {
      name: "Amazon Echo Dot",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg"
    },
    category: "Electronics",
    stockQty: 320,
    purchaseQty: 5,
    purchaseAmount: 1200
  },
  {
    id: 7,
    reference: "PO2025",
    sku: "PT009",
    dueDate: "2024-09-20",
    product: {
      name: "Gaming Chair",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg"
    },
    category: "Furniture",
    stockQty: 410,
    purchaseQty: 10,
    purchaseAmount: 300
  },
  {
    id: 8,
    reference: "PO2025",
    sku: "PT001",
    dueDate: "2024-12-24",
    product: {
      name: "Lenovo IdeaPad 3",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg"
    },
    category: "Computers",
    stockQty: 100,
    purchaseQty: 5,
    purchaseAmount: 500
  },
  {
    id: 9,
    reference: "PO2025",
    sku: "PT006",
    dueDate: "2024-10-25",
    product: {
      name: "Sanford Chair Sofa",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg"
    },
    category: "Furniture",
    stockQty: 650,
    purchaseQty: 7,
    purchaseAmount: 800
  },
  {
    id: 10,
    reference: "PO2025",
    sku: "PT003",
    dueDate: "2024-11-27",
    product: {
      name: "Nike Jordan",
      image: "https://m.media-amazon.com/images/I/61u0y9ADElL._AC_SL1000_.jpg"
    },
    category: "Shoe",
    stockQty: 300,
    purchaseQty: 8,
    purchaseAmount: 600
  }
];



export default function PurchaseReport() {
  const [reports] = useState(dummyPurchaseReports);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PurchaseReportList reports={reports} />
    </div>
  );
}