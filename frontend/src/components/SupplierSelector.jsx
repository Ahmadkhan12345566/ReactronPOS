import React, { useState } from "react";

const SupplierSelector = ({ value, onChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState("");

  const suppliers = ["ABC Supplies", "XYZ Traders", "Global Mart"];

  const handleAddSupplier = () => {
    // You could save to backend here
    if (newSupplier) {
      suppliers.push(newSupplier);
      onChange(newSupplier);
      setNewSupplier("");
      setShowModal(false);
    }
  };

  return (
    <>
      <label className="block font-medium mb-1">
        Supplier
        <span className="ml-1 text-xs text-gray-500">(Please select this before adding products)</span>
      </label>

      <div className="flex gap-2">
        <select
          className="w-full border px-3 py-2 rounded"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s, idx) => (
            <option key={idx} value={s}>{s}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-3 py-2 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </div>

      {/* Modal to add new supplier */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Add New Supplier</h3>
            <input
              type="text"
              value={newSupplier}
              onChange={(e) => setNewSupplier(e.target.value)}
              placeholder="Supplier name"
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button className="border px-4 py-2 rounded" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAddSupplier}>Add</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupplierSelector;
