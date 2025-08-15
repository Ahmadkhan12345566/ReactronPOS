// components/CustomerSelect.jsx
import React from 'react';

export default function CustomerSelect({ customerFilter, setCustomerFilter, customerOptions = [] }) {
  return (
    <div className="md:col-span-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
      <select
        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        value={customerFilter}
        onChange={e => setCustomerFilter(e.target.value)}
      >
        {customerOptions.map(customer => (
          <option key={customer} value={customer}>{customer}</option>
        ))}
      </select>
    </div>
  );
}
