// components/DateRangePicker.jsx
import React from 'react';

export default function DateRangePicker({ fromDate, toDate, setFromDate, setToDate }) {
  return (
    <div className="md:col-span-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">Choose Date</label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="date"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            aria-label="From date"
          />
        </div>
        <div>
          <input
            type="date"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            aria-label="To date"
          />
        </div>
      </div>
    </div>
);
}
