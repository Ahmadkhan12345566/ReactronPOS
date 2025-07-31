// src/pages/AddPurchase.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SupplierSelector from "../components/SupplierSelector";
import OrderItemsTable from "../components/OrderItemsTable";

const AddPurchase = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    supplier: "",
    date: "",
    reference: "",
    status: "",
    paymentMethod: "",
    notes: "",
    items: [],
  });

  const dummyItems = [
    {
      code: "WM123",
      name: "Wireless Mouse",
      cost: 1000,
      quantity: 2,
      discount: 0,
      subtotal: 2000,
    },
    {
      code: "GK789",
      name: "Gaming Keyboard",
      cost: 2000,
      quantity: 1,
      discount: 10,
      subtotal: 1800,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting purchase:", form);
    navigate("/purchases");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Add New Purchase</h2>
        <Link to="/purchases" className="text-blue-600 underline text-sm">
          ← Back to Purchase List
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <SupplierSelector
              value={form.supplier}
              onChange={(val) => setForm({ ...form, supplier: val })}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Purchase Date *</label>
            <input
              name="date"
              type="date"
              className="w-full border px-3 py-2 rounded"
              onChange={handleChange}
              value={form.date}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Reference No</label>
            <input
              name="reference"
              className="w-full border px-3 py-2 rounded"
              onChange={handleChange}
              value={form.reference}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Status *</label>
            <select
              name="status"
              className="w-full border px-3 py-2 rounded"
              onChange={handleChange}
              value={form.status}
              required
            >
              <option value="">Select status</option>
              <option value="Ordered">Ordered</option>
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Attachments</label>
            <input type="file" className="w-full border px-3 py-2 rounded" />
          </div>
        </div>

        <div>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="Search product or scan barcode"
          />
        </div>

        <div>
          {/* Replace dummyItems with real items state later */}
          <OrderItemsTable items={dummyItems} />
        </div>

        <div>
          <label className="block font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            rows="3"
            className="w-full border px-3 py-2 rounded"
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="border px-4 py-2 rounded"
            onClick={() => navigate("/purchases")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Purchase
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPurchase;
