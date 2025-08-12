import React, { useState } from "react";
import PurchaseList from "../components/PurchaseList";
import { useNavigate } from "react-router-dom";

// Updated dummy data to match new template requirements
const dummyPurchases = [
  { 
    id: 1, 
    reference: 'PT001',
    date: "2024-07-29", 
    supplier: "ABC Supplies", 
    status: "Received",
    total: 5000,
    paid: 5000,
    due: 0,
    paymentStatus: "Paid"
  },
  { 
    id: 2, 
    reference: 'PT002',
    date: "2024-07-28", 
    supplier: "XYZ Traders", 
    status: "Pending",
    total: 3400,
    paid: 0,
    due: 3400,
    paymentStatus: "Unpaid"
  },
  { 
    id: 3, 
    reference: 'PT003',
    date: "2024-07-27", 
    supplier: "Global Mart", 
    status: "Received",
    total: 2120,
    paid: 2120,
    due: 0,
    paymentStatus: "Paid"
  },
  { 
    id: 4, 
    reference: 'PT004',
    date: "2024-07-26", 
    supplier: "Tech Suppliers", 
    status: "Ordered",
    total: 15000,
    paid: 5000,
    due: 10000,
    paymentStatus: "Overdue"
  },
];

const Purchases = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <PurchaseList 
          purchases={dummyPurchases} 
          onAddPurchase={() => navigate("/purchases/add")}
        />
      </div>
    </div>
  );
};

export default Purchases;
