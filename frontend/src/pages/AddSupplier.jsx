import React, { useState } from 'react';
import Accordion from '../components/forms/Accordion';
import PageHeader from '../components/forms/PageHeader';
import FormFooter from '../components/forms/FormFooter';
import { useNavigate } from 'react-router-dom';
import { usePos } from '../hooks/usePos';
import { api } from '../services/api';
import {
  ArrowPathIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

const AddSupplier = () => {
  const { currentUser } = usePos();
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Add image if exists
      if (selectedImage) {
        data.image = selectedImage;
      }
      
      console.log('Data to send:', data);
      await api.post('/api/suppliers', data);
      navigate('/suppliers');
    } catch (error) {
      console.error('Error creating supplier:', error);
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64Image = await toBase64(file);
      setSelectedImage(base64Image);
    } catch (err) {
      console.error('Image conversion error:', err);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="bg-gray-50 flex flex-col h-full p-6">
      <PageHeader 
        title="Create Supplier"
        subtitle="Create new supplier"
        backPath="/suppliers"
        actionButtons={
          <>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <ArrowPathIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <ChevronUpIcon className="w-5 h-5" />
            </button>
          </>
        }
      />

      <form className="bg-white rounded-xl shadow-sm p-6 flex flex-col min-h-0 h-full" onSubmit={handleSubmit}>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Accordion 
            title="Supplier Information"
            icon={InformationCircleIcon}
            isOpen={true}
            onToggle={() => {}}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Name <span className="text-red-500">*</span>
                </label>
                <input 
                  name="name"
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter supplier name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input 
                  name="email"
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input 
                  name="phone"
                  type="tel" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input 
                  name="address"
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter address"
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
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </Accordion>

          <Accordion 
            title="Profile Image"
            icon={PhotoIcon}
            isOpen={true}
            onToggle={() => {}}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Profile Image
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <PhotoIcon className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input 
                  name="image"
                  type="file" 
                  className="hidden" 
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </label>
            </div>
            
            {selectedImage && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Image</h3>
                <div className="relative group w-32 h-32">
                  <img 
                    src={selectedImage} 
                    alt="Supplier preview" 
                    className="w-full h-full object-cover rounded-lg border border-gray-600"
                  />
                  <button 
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={removeImage}
                    type="button"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </Accordion>
        </div>

        <FormFooter 
          cancelPath="/suppliers" 
          submitLabel="Add Supplier" 
          disabled={currentUser.role !== 'admin'}
        />
      </form>
    </div>
  );
};

export default AddSupplier;