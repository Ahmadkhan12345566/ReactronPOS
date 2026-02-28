// components/GenerateButton.jsx
import React from 'react';

export default function GenerateButton({ onClick, label = "Generate" }) {
  return (
    <div className="md:col-span-1 flex items-end">
      <button
        type="button"
        onClick={onClick}
        className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
      >
        {label}
      </button>
    </div>
  );
}
