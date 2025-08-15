import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SupplierSelector from "../components/SupplierSelector";
import OrderItemsTable from "../components/OrderItemsTable";
import Accordion from "../components/forms/Accordion";
import PageHeader from "../components/forms/PageHeader";
import FormFooter from "../components/forms/FormFooter";
import {
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
      <PageHeader 
        title="Add New Purchase"
        subtitle="Create new purchase order"
        backPath="/purchases"
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 flex flex-col min-h-0 h-full">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Accordion 
            title="Purchase Information"
            icon={InformationCircleIcon}
            isOpen={accordion.purchaseInfo}
            onToggle={() => toggleAccordion("purchaseInfo")}
          >
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
          </Accordion>

          <Accordion 
            title="Order Items"
            icon={DocumentTextIcon}
            isOpen={accordion.orderItems}
            onToggle={() => toggleAccordion("orderItems")}
          >
            <div className="mb-4">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search product or scan barcode"
              />
            </div>
            <OrderItemsTable items={dummyItems} />
          </Accordion>

          <Accordion 
            title="Additional Information"
            icon={PlusCircleIcon}
            isOpen={accordion.additionalInfo}
            onToggle={() => toggleAccordion("additionalInfo")}
          >
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
          </Accordion>
        </div>

        <FormFooter 
          cancelPath="/purchases" 
          submitLabel="Save Purchase" 
          onCancel={() => navigate("/purchases")}
        />
      </form>
    </div>
  );
};

export default AddPurchase;