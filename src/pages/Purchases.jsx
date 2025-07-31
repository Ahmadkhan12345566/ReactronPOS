import React, { useState } from "react";
import PurchaseList from "../components/PurchaseList";
import { useNavigate } from "react-router-dom";


// Dummy purchase data (can be replaced with props or fetched later)
const dummyPurchases = [
  { id: 1, date: "2024-07-29", supplier: "ABC Supplies", total: 5000 },
  { id: 2, date: "2024-07-28", supplier: "XYZ Traders", total: 3400 },
  { id: 3, date: "2024-07-27", supplier: "Global Mart", total: 2120 },
];

const Purchases = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate(); // ✅ define it here

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Purchases</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/purchase/add")}
        >
          Add New Purchae
        </button>
      </div>

      {/* Purchase List */}
      <PurchaseList purchases={dummyPurchases} onAddPurchase={() => setShowForm(true)} />

      {/* Modal for Purchase Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Purchase</h3>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>
            <PurchaseForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;
