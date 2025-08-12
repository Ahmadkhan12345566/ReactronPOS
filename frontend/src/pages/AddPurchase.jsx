import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SupplierSelector from "../components/SupplierSelector";
import OrderItemsTable from "../components/OrderItemsTable";
import {
  ArrowLeftIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

const AddPurchase = () => {
  const navigate = useNavigate();
  const [accordion, setAccordion] = useState({
    purchaseInfo: true,
    orderItems: false,
    additionalInfo: false,
  });

  const [form, setForm] = useState({
    supplier: "",
    date: "",
    reference: "",
    status: "",
    paymentMethod: "",
    notes: "",
    items: [],
  });

  const toggleAccordion = (section) => {
    setAccordion((prev) => {
      const newState = {};
      Object.keys(prev).forEach(key => {
        newState[key] = key === section ? !prev[section] : false;
      });
      return newState;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting purchase:", form);
    navigate("/purchases");
  };

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

  return (
    <div className="bg-gray-50 flex flex-col h-full p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add New Purchase</h1>
          <p className="text-gray-600">Create new purchase order</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/purchases"
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Purchases
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 flex flex-col min-h-0 h-full">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="border border-gray-800 rounded-lg mb-6">
            <button
              type="button"
              className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
              onClick={() => toggleAccordion("purchaseInfo")}
            >
              <div className="flex items-center">
                <InformationCircleIcon className="w-5 h-5 text-black mr-2" />
                <span className="font-medium">Purchase Information</span>
              </div>
              <ChevronUpIcon
                className={`w-5 h-5 transition-transform ${
                  accordion.purchaseInfo ? "rotate-0" : "rotate-180"
                }`}
              />
            </button>

            {accordion.purchaseInfo && (
              <div className="p-4 border-t border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier <span className="text-red-500">*</span>
                    </label>
                    <SupplierSelector
                      value={form.supplier}
                      onChange={(val) => setForm({ ...form, supplier: val })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purchase Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="date"
                      type="date"
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleChange}
                      value={form.date}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reference No
                    </label>
                    <input
                      name="reference"
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleChange}
                      value={form.reference}
                      placeholder="Enter reference number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="paymentMethod"
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleChange}
                      value={form.paymentMethod}
                      required
                    >
                      <option value="">Select method</option>
                      <option value="Cash">Cash</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attachments
                    </label>
                    <input
                      type="file"
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border border-gray-800 rounded-lg mb-6">
            <button
              type="button"
              className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
              onClick={() => toggleAccordion("orderItems")}
            >
              <div className="flex items-center">
                <DocumentTextIcon className="w-5 h-5 text-black mr-2" />
                <span className="font-medium">Order Items</span>
              </div>
              <ChevronUpIcon
                className={`w-5 h-5 transition-transform ${
                  accordion.orderItems ? "rotate-0" : "rotate-180"
                }`}
              />
            </button>

            {accordion.orderItems && (
              <div className="p-4 border-t border-gray-600">
                <div className="mb-4">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search product or scan barcode"
                  />
                </div>
                <OrderItemsTable items={dummyItems} />
              </div>
            )}
          </div>

          <div className="border border-gray-800 rounded-lg mb-6">
            <button
              type="button"
              className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
              onClick={() => toggleAccordion("additionalInfo")}
            >
              <div className="flex items-center">
                <PlusCircleIcon className="w-5 h-5 text-black mr-2" />
                <span className="font-medium">Additional Information</span>
              </div>
              <ChevronUpIcon
                className={`w-5 h-5 transition-transform ${
                  accordion.additionalInfo ? "rotate-0" : "rotate-180"
                }`}
              />
            </button>

            {accordion.additionalInfo && (
              <div className="p-4 border-t border-gray-600">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Enter purchase notes"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200 sticky bottom-0 bg-white z-10">
          <button
            type="button"
            className="px-6 py-2 border border-gray-600 text-gray-700 rounded-lg hover:bg-gray-50"
            onClick={() => navigate("/purchases")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-blue-700"
          >
            Save Purchase
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPurchase;