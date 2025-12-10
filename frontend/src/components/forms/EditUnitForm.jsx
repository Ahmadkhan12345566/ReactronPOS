import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function EditUnitForm({ unit, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    status: 'Active',
  });

  useEffect(() => {
    if (unit) {
      setFormData({
        name: unit.name,
        short_name: unit.short_name,
        status: unit.status,
      });
    }
  }, [unit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/units/${unit.id}`, formData);
      onSave();
    } catch (error) {
      console.error('Error updating unit:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter unit name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Name <span className="text-red-500">*</span>
          </label>
          <input
            name="short_name"
            type="text"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter short name"
            value={formData.short_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Save
        </button>
      </div>
    </form>
  );
}
