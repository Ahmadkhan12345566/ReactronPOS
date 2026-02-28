// components/forms/SubcategoryModal.jsx
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { api } from '../../services/api';

const SubcategoryModal = ({ showModal, setShowModal, onSubcategoryCreated }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    status: 'Active',
    categoryId: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await api.get('/api/categories');
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    if (showModal) {
      fetchCategories();
    }
  }, [showModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newSubcategory = await api.post('/api/sub-categories', formData);
      onSubcategoryCreated(newSubcategory);
      setShowModal(false);
      setFormData({ name: '', status: 'Active', categoryId: '' }); // Reset form
    } catch (error) {
      console.error('Error creating subcategory:', error);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl border border-gray-800 overflow-hidden" onClick={e => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-800">
            <h3 className="text-xl font-bold text-gray-800">Create New Subcategory</h3>
            <button 
              onClick={() => setShowModal(false)}
              className="p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          {/* Modal Body */}
          <div className="p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory Name <span className="text-red-500">*</span>
                </label>
                <input 
                  name="name"
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter subcategory name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select 
                  name="categoryId"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select 
                  name="status"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                  Create Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryModal;