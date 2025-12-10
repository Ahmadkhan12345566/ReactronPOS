// frontend/src/components/forms/SupplierModal.jsx

import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { api } from '../../services/api';

const SupplierModal = ({ showModal, setShowModal, onSupplierCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Stop click from closing the modal
    e.stopPropagation(); 
    try {
      const newSupplier = await api.post('/api/suppliers', formData);
      onSupplierCreated(newSupplier);
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', address: '', status: 'Active' }); // Reset form
    } catch (error) {
      console.error('Error creating supplier:', error);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
      <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-xl shadow-xl border border-gray-800">
          <div className="flex items-center justify-between p-4 border-b border-gray-600">
            <h3 className="text-lg font-semibold">Create New Supplier</h3>
            <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-gray-200">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                name="name"
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-600 rounded-lg"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input 
                type="text"
                name="phone"
                className="w-full px-3 py-2 border border-gray-600 rounded-lg"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                rows="2"
                className="w-full px-3 py-2 border border-gray-600 rounded-lg"
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button 
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-600 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Create Supplier
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupplierModal;