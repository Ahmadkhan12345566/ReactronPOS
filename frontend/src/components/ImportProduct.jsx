import React, { useState } from 'react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
const ImportProduct = ({ showForm, setShowForm }) => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('csvFile', selectedFile);
      formData.append('product', e.target.product.value);
      // Add other form fields as needed

      await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setShowForm(false);
      navigate.push('/products'); // Redirect after success
    } catch (error) {
      console.error('Error importing products:', error);
      // Handle error
    }
  };
  return (
    <>
    {showForm && 
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
      <div className="relative w-full max-w-2xl"> {/* Added max height */}
        {/* Modal Content */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-800 overflow-hidden flex flex-col h-[90vh]" onClick={e => e.stopPropagation()}> {/* Added flex column */}
          
          {/* Modal Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-800">
            <h3 className="text-xl font-bold text-gray-800">Import Product</h3>
            <button onClick={()=> setShowForm(false)}
              className="p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          {/* Modal Body - Made scrollable */}
          <div className="p-6 overflow-y-auto flex-grow"> {/* Added overflow and flex-grow */}
            <form className="space-y-6" onSubmit={handleSubmit}> {/* Moved space-y-6 here */}
              <div className="space-y-6">
                {/* Product Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option>Select</option>
                    <option>Bold V3.2</option>
                    <option>Nike Jordan</option>
                    <option>Iphone 14 Pro</option>
                  </select>
                </div>
                
                {/* Category & Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                      <option>Select</option>
                      <option>Laptop</option>
                      <option>Electronics</option>
                      <option>Shoe</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub Category <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                      <option>Select</option>
                      <option>Lenovo</option>
                      <option>Bolt</option>
                      <option>Nike</option>
                    </select>
                  </div>
                </div>
                
                {/* Download Sample */}
                <div className="flex justify-center">
                  <button 
                    type="button"
                    className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                    Download Sample File
                  </button>
                </div>
                
                {/* CSV Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload CSV File
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="file" 
                      className="hidden" 
                      id="csv-upload"
                      accept=".csv"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-200 rounded-full p-3 mb-3">
                          <ArrowDownTrayIcon className="w-8 h-8 text-gray-600" />
                        </div>
                        <h4 className="font-medium text-gray-800">
                          Drag and drop a <span className="text-black font-semibold">file to upload</span>
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Only CSV files accepted (Max size: 10MB)
                        </p>
                        {selectedFile && (
                          <p className="mt-3 text-sm text-gray-700">
                            Selected: {selectedFile.name}
                          </p>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Created By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Created by <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter creator name"
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                    placeholder="Enter description"
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">Maximum 60 Characters</p>
                </div>
              </div>
            </form>
          </div>
          
          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 p-5 border-t border-gray-800">
            <button 
              type="button"
              onClick={()=> setShowForm(false)}
              className="px-6 py-2 border border-gray-600 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
    }
    </>);
};

export default ImportProduct;