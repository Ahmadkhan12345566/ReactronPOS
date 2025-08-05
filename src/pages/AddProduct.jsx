import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowPathIcon,           // replaces ArrowPathIcon
  ChevronUpIcon,
  InformationCircleIcon,
  LifebuoyIcon,
  PhotoIcon,              // replaces PhotoIcon
  ListBulletIcon,         // replaces ListBulletIcon
  PlusCircleIcon,
  XMarkIcon               // replaces XMarkIcon
} from '@heroicons/react/24/outline';


const AddProduct = () => {
  const [accordion, setAccordion] = useState({
    productInfo: true,
    pricingStocks: true,
    images: true,
    customFields: true
  });
  
  const [productType, setProductType] = useState('single');
  const [selectedImages, setSelectedImages] = useState([]);
  const [customFields, setCustomFields] = useState({
    warranties: false,
    manufacturer: false,
    expiry: false
  });

  const toggleAccordion = (section) => {
    setAccordion(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleCustomField = (field) => {
    setCustomFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create Product</h1>
          <p className="text-gray-600">Create new product</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowPathIcon className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ChevronUpIcon className="w-5 h-5" />
          </button>
          <NavLink to="/products" className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Products
          </NavLink>
        </div>
      </div>

      {/* Product Form */}
      <form className="bg-white rounded-xl shadow-sm p-6">
      {/* Product Information Accordion */}
      <div className="border border-gray-800 rounded-lg mb-6">
        <button type="button"
          className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
          onClick={() => toggleAccordion('productInfo')}
        >
          <div className="flex items-center">
            <InformationCircleIcon className="w-5 h-5 text-black mr-2" />
              <span className="font-medium">Product Information</span>
            </div>
            <ChevronUpIcon className={`w-5 h-5 transition-transform ${accordion.productInfo ? 'rotate-0' : 'rotate-180'}`} />
          </button>
          
          {accordion.productInfo && (
            <div className="p-4 border-t border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option>Select</option>
                    <option>Electro Mart</option>
                    <option>Quantum Gadgets</option>
                    <option>Gadget World</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warehouse <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option>Select</option>
                    <option>Lavish Warehouse</option>
                    <option>Quaint Warehouse</option>
                    <option>Traditional Warehouse</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter slug"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-600 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter SKU"
                    />
                    <button className="px-4 py-2 bg-black text-white rounded-r-lg hover:bg-blue-700">
                      Generate
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selling Type <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option>Select</option>
                    <option>Online</option>
                    <option>POS</option>
                  </select>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <button className="flex items-center text-black text-sm">
                      <PlusCircleIcon className="w-4 h-4 mr-1" />
                      Add New
                    </button>
                  </div>
                  <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option>Select</option>
                    <option>Food</option>
                    <option>Beverages</option>
                    <option>Electronics</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Category <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option>Select</option>
                    <option>Main Course</option>
                    <option>Desserts</option>
                    <option>Snacks</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option>Select</option>
                    <option>CafeCo</option>
                    <option>PremiumBrand</option>
                    <option>EcoGoods</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option>Select</option>
                    <option>Pc</option>
                    <option>Kg</option>
                    <option>L</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode Symbology <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option>Select</option>
                    <option>Code 128</option>
                    <option>Code 39</option>
                    <option>UPC-A</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Barcode <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-600 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter barcode"
                    />
                    <button className="px-4 py-2 bg-black text-white rounded-r-lg hover:bg-blue-700">
                      Generate
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
                  placeholder="Enter product description"
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">Maximum 60 Words</p>
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Stocks Accordion */}
        <div className="border border-gray-800 rounded-lg mb-6">
          <button type="button"
            className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
            onClick={() => toggleAccordion('pricingStocks')}
          >
            <div className="flex items-center">
              <LifebuoyIcon className="w-5 h-5 text-black mr-2" />
              <span className="font-medium">Pricing & Stocks</span>
            </div>
            <ChevronUpIcon className={`w-5 h-5 transition-transform ${accordion.pricingStocks ? 'rotate-0' : 'rotate-180'}`} />
          </button>
          
          {accordion.pricingStocks && (
            <div className="p-4 border-t border-gray-600">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Type <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="productType"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      checked={productType === 'single'}
                      onChange={() => setProductType('single')}
                    />
                    <span className="ml-2 text-gray-700">Single Product</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="productType"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      checked={productType === 'variable'}
                      onChange={() => setProductType('variable')}
                    />
                    <span className="ml-2 text-gray-700">Variable Product</span>
                  </label>
                </div>
              </div>
              
              {productType === 'single' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter quantity"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter price"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Type <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                      <option>Select</option>
                      <option>Exclusive</option>
                      <option>Inclusive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                      <option>Select</option>
                      <option>IGST (8%)</option>
                      <option>GST (5%)</option>
                      <option>SGST (4%)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                      <option>Select</option>
                      <option>Percentage</option>
                      <option>Fixed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Value <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter discount"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity Alert <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter alert quantity"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Variant Attribute <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        <option>Choose</option>
                        <option>Color</option>
                        <option>Size</option>
                        <option>Material</option>
                      </select>
                      <button className="ml-3 p-2 bg-black text-white rounded-lg hover:bg-blue-700">
                        <PlusCircleIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variation</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant Value</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3">
                            <input 
                              type="text" 
                              className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                              defaultValue="Color"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="text" 
                              className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                              defaultValue="Red"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="text" 
                              className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                              defaultValue="FD001-RED"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <button className="px-2 py-1 bg-gray-200 rounded-l">-</button>
                              <input 
                                type="number" 
                                className="w-16 px-2 py-1 border-y border-gray-600 text-center"
                                defaultValue="10"
                              />
                              <button className="px-2 py-1 bg-gray-200 rounded-r">+</button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="number" 
                              className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                              defaultValue="7.99"
                            />
                          </td>
                          <td className="px-4 py-3 flex space-x-2">
                            <button className="p-1 text-black hover:bg-blue-50 rounded">
                              <PlusCircleIcon className="w-5 h-5" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">
                            <input 
                              type="text" 
                              className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                              defaultValue="Color"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="text" 
                              className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                              defaultValue="Blue"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="text" 
                              className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                              defaultValue="FD001-BLUE"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <button className="px-2 py-1 bg-gray-200 rounded-l">-</button>
                              <input 
                                type="number" 
                                className="w-16 px-2 py-1 border-y border-gray-600 text-center"
                                defaultValue="15"
                              />
                              <button className="px-2 py-1 bg-gray-200 rounded-r">+</button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="number" 
                              className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                              defaultValue="7.99"
                            />
                          </td>
                          <td className="px-4 py-3 flex space-x-2">
                            <button className="p-1 text-black hover:bg-blue-50 rounded">
                              <PlusCircleIcon className="w-5 h-5" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Images Accordion */}
        <div className="border border-gray-800 rounded-lg mb-6">
          <button type="button"
            className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
            onClick={() => toggleAccordion('images')}
          >
            <div className="flex items-center">
              <PhotoIcon className="w-5 h-5 text-black mr-2" />
              <span className="font-medium">Images</span>
            </div>
            <ChevronUpIcon className={`w-5 h-5 transition-transform ${accordion.images ? 'rotate-0' : 'rotate-180'}`} />
          </button>
          
          {accordion.images && (
            <div className="p-4 border-t border-gray-600">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Product Images
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PlusCircleIcon className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              
              {selectedImages.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={img} 
                          alt={`Product preview ${index}`} 
                          className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        />
                        <button 
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Custom Fields Accordion */}
        <div className="border border-gray-800 rounded-lg mb-6">
          <button type="button"
            className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
            onClick={() => toggleAccordion('customFields')}
          >
            <div className="flex items-center">
              <ListBulletIcon className="w-5 h-5 text-black mr-2" />
              <span className="font-medium">Custom Fields</span>
            </div>
            <ChevronUpIcon className={`w-5 h-5 transition-transform ${accordion.customFields ? 'rotate-0' : 'rotate-180'}`} />
          </button>
          
          {accordion.customFields && (
            <div className="p-4 border-t border-gray-600">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-600 mb-6">
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                      checked={customFields.warranties}
                      onChange={() => toggleCustomField('warranties')}
                    />
                    <span className="ml-2 text-gray-700">Warranties</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                      checked={customFields.manufacturer}
                      onChange={() => toggleCustomField('manufacturer')}
                    />
                    <span className="ml-2 text-gray-700">Manufacturer</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                      checked={customFields.expiry}
                      onChange={() => toggleCustomField('expiry')}
                    />
                    <span className="ml-2 text-gray-700">Expiry</span>
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customFields.warranties && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warranty <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                      <option>Select</option>
                      <option>1 Year Warranty</option>
                      <option>2 Year Warranty</option>
                      <option>Lifetime Warranty</option>
                    </select>
                  </div>
                )}
                
                {customFields.manufacturer && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manufacturer <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter manufacturer"
                    />
                  </div>
                )}
                
                {customFields.manufacturer && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manufactured Date <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
                
                {customFields.expiry && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 mt-8">
          <NavLink
            to={"/products"}
            className="px-6 py-2 border border-gray-600 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </NavLink>
          <button 
            type="submit" 
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;