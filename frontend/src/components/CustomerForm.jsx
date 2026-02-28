// frontend/src/components/CustomerForm.jsx

import { useState } from 'react';
import { api } from '../services/api'; // <-- IMPORT THE API

export default function CustomerForm({ isOpen, onClose, onAddCustomer }) {
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: ''
  });
  
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null); // <-- Add API error state

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newCustomer.name.trim()) newErrors.name = 'Customer Name is required';
    if (!newCustomer.phone.trim()) newErrors.phone = 'Phone is required';
    return newErrors;
  };

  // --- MODIFIED SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setApiError(null); // Clear previous API errors

    try {
      // 1. Call the API to save the customer
      const savedCustomer = await api.post('/api/customers', newCustomer);
      
      // 2. Pass the REAL, saved customer back to the POS page
      onAddCustomer(savedCustomer);
      
      // 3. Close and reset the form
      onClose();
      setNewCustomer({ name: '', phone: '', email: '', address: '', city: '', country: '' });

    } catch (error) {
      console.error("Failed to create customer:", error);
      setApiError(error.message || "An unknown error occurred.");
    }
  };
  // --- END OF MODIFICATIONS ---

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-xl border border-gray-800 w-full max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-xl font-semibold mb-6">Add New Customer</h2>
          
          {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-center">
              {apiError}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={newCustomer.name}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={newCustomer.phone}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            
            {/* ... (rest of the inputs: email, address, city, country) ... */}
            
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}