import React, { useState, useEffect } from 'react';
import Accordion from '../components/forms/Accordion';
import PageHeader from '../components/forms/PageHeader';
import FormFooter from '../components/forms/FormFooter';
import { useNavigate } from 'react-router-dom';
import SubcategoryModal from '../components/forms/SubcategoryModal';
import SupplierModal from '../components/forms/SupplierModal'; 
import StoreModal from '../components/forms/StoreModal';
import { usePos } from '../hooks/usePos';
import { api } from '../services/api';
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  LifebuoyIcon,
  PhotoIcon,
  ListBulletIcon,
  PlusCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AddProduct = () => {
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false); 
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [stores, setStores] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const { currentUser } = usePos();
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [accordion, setAccordion] = useState({
    productInfo: true,
    pricingStocks: false,
    images: false,
    customFields: false
  });
  
  const navigate = useNavigate();  
  const [productType, setProductType] = useState('single');
  const [selectedImages, setSelectedImages] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customFields, setCustomFields] = useState({
    warranties: false,
    manufacturer: false,
    expiry: false
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catsResponse, brandsResponse, unitsResponse, storesResponse, subCatsResponse, suppliersResponse] = await Promise.all([
          api.get('/api/categories'),
          api.get('/api/brands'),
          api.get('/api/units'),
          api.get('/api/stores'),
          api.get('/api/sub-categories'),
          api.get('/api/suppliers')
        ]);
        setCategories(catsResponse);
        setBrands(brandsResponse);
        setUnits(unitsResponse);
        setStores(storesResponse);
        setSubCategories(subCatsResponse);
        setSuppliers(suppliersResponse);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchOptions();
  }, []);
  const generateSKU = () => {
    const randomNumber = Math.floor(Math.random() * 1000000); // Generates random number between 0-999999
    return `SK${randomNumber}`;
  };
  const handleSupplierCreated = (newSupplier) => {
    setSuppliers(prevSuppliers => [...prevSuppliers, newSupplier]);
    setShowSupplierModal(false);
  };
  
  const handleSubcategoryCreated = (newSubcategory) => {
    setSubCategories(prevSubCategories => [...prevSubCategories, newSubcategory]);
    setShowSubcategoryModal(false);
  };
  const handleStoreCreated = (newStore) => {
    setStores(prevStores => [...prevStores, newStore]);
    setShowStoreModal(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Convert image to base64 if exists
      if (selectedImages.length > 0) {
        data.image = selectedImages[0];
      }
      
      if (!currentUser || !currentUser.id) throw new Error('Current user ID not found');
      data.createdBy = currentUser.id;
      
      // Build variants array based on product type
      let variants = [];
      
      if (data.productType === 'single') {
        variants = [{
          sku: data.sku,
          itemBarcode: data.itemBarcode || '',
          price: parseFloat(data.price) || 0,
          cost: 0,
          weight: 0,
          attributes: {},
          expiryDate: data.expiryDate || null,
          manufacturedDate: data.manufacturedDate || null,
          inventories: [{
            storeId: data.storeId,
            qty: parseInt(data.quantity) || 0,
            quantityAlert: parseInt(data.quantityAlert) || 0
          }]
        }];
      } else if (data.productType === 'variable') {
        let index = 1;
        while (data[`variantAttribute${index}`]) {
          variants.push({
            sku: data[`variantSKU${index}`],
            itemBarcode: '',
            price: parseFloat(data[`variantPrice${index}`]) || 0,
            cost: 0,
            weight: 0,
            attributes: {
              [data[`variantAttribute${index}`]]: data[`variantValue${index}`]
            },
            expiryDate: data.expiryDate || null,
            manufacturedDate: data.manufacturedDate || null,
            inventories: [{
              storeId: data.storeId,
              qty: parseInt(data[`variantQuantity${index}`]) || 0,
              quantityAlert: parseInt(data.quantityAlert) || 0
            }]
          });
          index++;
        }
      }
      
      // Create product with variants in a single request
      const productData = {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId,
        brandId: data.brandId,
        unitId: data.unitId,
        productType: data.productType,
        taxType: data.taxType,
        tax: data.tax,
        createdBy: data.createdBy,
        discountType: data.discountType,
        discountValue: data.discountValue,
        warranties: data.warranties,
        barcodeSymbology: data.barcodeSymbology,
        sellingType: data.sellingType,
        image: data.image,
        variants: variants,
        supplierId: data.supplierId,
        slug: data.slug
      };
      if (data.productType === 'single') {
        productData.sku = data.sku;
        productData.price = data.price;
        productData.quantity = data.quantity;
        productData.storeId = data.storeId;
        productData.itemBarcode = data.itemBarcode;
        productData.quantityAlert = data.quantityAlert;
      }
      
      await api.post('/api/products', productData);
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      // Add currentUser-friendly error handling here
    }
};

  const toggleAccordion = (section) => {
    setAccordion(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
    const files = Array.from(e.target.files);

    try {
      const base64Images = await Promise.all(files.map(file => toBase64(file)));
      setSelectedImages(prev => [...prev, ...base64Images]);
    } catch (err) {
      console.error('Image conversion error:', err);
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleCustomField = (field) => {
    setCustomFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="bg-gray-50 flex flex-col h-full p-6">
      <PageHeader 
        title="Create Product"
        subtitle="Create new product"
        backPath="/products"
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
            title="Product Information"
            icon={InformationCircleIcon}
            isOpen={accordion.productInfo}
            onToggle={() => toggleAccordion('productInfo')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store <span className="text-red-500">*</span>
                  </label>
                  <button 
                  type="button" 
                  onClick={() => setShowStoreModal(true)}
                  className="flex items-center text-black text-sm"
                >
                  <PlusCircleIcon className="w-4 h-4 mr-1" />
                  Add New
                </button>
              </div>
                <select 
                  name="storeId" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setShowSupplierModal(true)}
                    className="flex items-center text-black text-sm"
                  >
                    <PlusCircleIcon className="w-4 h-4 mr-1" />
                    Add New
                  </button>
                </div>
                <select 
                  name="supplierId" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input 
                  name="name"
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input 
                  name="slug"
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
                    name="sku"
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-600 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter SKU"
                  />
                  <button type="button" className="px-4 py-2 bg-black text-white rounded-r-lg hover:bg-blue-700"
                  onClick={(e) => {
                    const skuInput = e.target.closest('div').querySelector('input[name="sku"]');
                    skuInput.value = generateSKU();
                  }}>
                    Generate
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Type <span className="text-red-500">*</span>
                </label>
                <select name="sellingType" className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
                  <option value="">Select</option>
                  <option value="Online">Online</option>
                  <option value="POS">POS</option>
                </select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <button type="button" onClick={()=>window.location.replace("/#/categories/add")} className="flex items-center text-black text-sm">
                    <PlusCircleIcon className="w-4 h-4 mr-1" />
                    Add New
                  </button>
                </div>
                <select name="categoryId" className="w-full px-3 py-2 border border-gray-600 rounded-lg" required>
                  <option value="">Select</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Category <span className="text-red-500">*</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setShowSubcategoryModal(true)}
                    className="flex items-center text-black text-sm"
                  >
                    <PlusCircleIcon className="w-4 h-4 mr-1" />
                    Add New
                  </button>
                </div>
                <select 
                  name="subCategoryId" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  {subCategories.map(subCat => (
                    <option key={subCat.id} value={subCat.id}>{subCat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand <span className="text-red-500">*</span>
                </label>
                <select name="brandId" className="w-full px-3 py-2 border border-gray-600 rounded-lg">
                  <option value="">Select</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit <span className="text-red-500">*</span>
                </label>
                <select name="unitId" className="w-full px-3 py-2 border border-gray-600 rounded-lg">
                  <option value="">Select</option>
                  {units.map(unit => (
                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Barcode Symbology
                </label>
                <select name="barcodeSymbology" className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select</option>
                  <option value="Code 128">Code 128</option>
                  <option value="Code 39">Code 39</option>
                  <option value="UPC-A">UPC-A</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Barcode
                </label>
                <div className="flex">
                  <input 
                    name="itemBarcode"
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-600 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter barcode"
                  />
                  <button type="button" className="px-4 py-2 bg-black text-white rounded-r-lg hover:bg-blue-700">
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
                name="description"
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
                placeholder="Enter product description"
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">Maximum 60 Words</p>
            </div>
          </Accordion>

          <Accordion 
            title="Pricing & Stocks"
            icon={LifebuoyIcon}
            isOpen={accordion.pricingStocks}
            onToggle={() => toggleAccordion('pricingStocks')}
          >
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Product Type <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="productType"
                    value="single"
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
                    value="variable"
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
                    name="quantity"
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="price"
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter price"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Type
                  </label>
                  <select name="taxType" className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select</option>
                    <option value="Exclusive">Exclusive</option>
                    <option value="Inclusive">Inclusive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax
                  </label>
                  <select name="tax" className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select</option>
                    <option value="8">IGST (8%)</option>
                    <option value="5">GST (5%)</option>
                    <option value="4">SGST (4%)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select name="discountType" className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select</option>
                    <option value="Percentage">Percentage</option>
                    <option value="Fixed">Fixed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value
                  </label>
                  <input 
                    name="discountValue"
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter discount"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity Alert
                  </label>
                  <input 
                    name="quantityAlert"
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
                    Variant Attribute
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
                          <input name="variantAttribute1"
                            type="text" 
                            className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                            defaultValue="Color"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input name="variantValue1"
                            type="text" 
                            className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                            defaultValue="Red"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input name="variantSKU1"
                            type="text" 
                            className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                            defaultValue="FD001-RED"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <button className="px-2 py-1 bg-gray-200 rounded-l">-</button>
                            <input name="variantQuantity1"
                              type="number" 
                              className="w-16 px-2 py-1 border-y border-gray-600 text-center"
                              defaultValue="10"
                            />
                            <button className="px-2 py-1 bg-gray-200 rounded-r">+</button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input name="variantPrice1"
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
                          <input name="variantAttribute2"
                            type="text" 
                            className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                            defaultValue="Color"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input name="variantValue2"
                            type="text" 
                            className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                            defaultValue="Blue"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input name="variantSKU2"
                            type="text" 
                            className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                            defaultValue="FD001-BLUE"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <button className="px-2 py-1 bg-gray-200 rounded-l">-</button>
                            <input name="variantQuantity2"
                              type="number" 
                              className="w-16 px-2 py-1 border-y border-gray-600 text-center"
                              defaultValue="15"
                            />
                            <button className="px-2 py-1 bg-gray-200 rounded-r">+</button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input name="variantPrice2"
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
          </Accordion>

          <Accordion 
            title="Images"
            icon={PhotoIcon}
            isOpen={accordion.images}
            onToggle={() => toggleAccordion('images')}
          >
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
                <input name="productImages"
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
          </Accordion>

          <Accordion 
            title="Custom Fields"
            icon={ListBulletIcon}
            isOpen={accordion.customFields}
            onToggle={() => toggleAccordion('customFields')}
          >
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-600 mb-6">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input name="warranties"
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                    checked={customFields.warranties}
                    onChange={() => toggleCustomField('warranties')}
                  />
                  <span className="ml-2 text-gray-700">Warranties</span>
                </label>
                <label className="flex items-center">
                  <input name="manufacturer"
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                    checked={customFields.manufacturer}
                    onChange={() => toggleCustomField('manufacturer')}
                  />
                  <span className="ml-2 text-gray-700">Manufacturer</span>
                </label>
                <label className="flex items-center">
                  <input name="expiry"
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
                    Warranty
                  </label>
                  <select name="warranty" className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select</option>
                    <option value="1 Year Warranty">1 Year Warranty</option>
                    <option value="2 Year Warranty">2 Year Warranty</option>
                    <option value="Lifetime Warranty">Lifetime Warranty</option>
                  </select>
                </div>
              )}
              
              {customFields.manufacturer && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manufacturer
                  </label>
                  <input name="manufacturerName"
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter manufacturer"
                  />
                </div>
              )}
              
              {customFields.manufacturer && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manufactured Date
                  </label>
                  <input name="manufacturedDate"
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              
              {customFields.expiry && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input name="expiryDate"
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </Accordion>
        </div>

        <FormFooter 
          cancelPath="/products" 
          submitLabel="Add Product" 
          disabled={currentUser.role !== 'admin'}
        />
      </form>
      <StoreModal 
        showModal={showStoreModal}
        setShowModal={setShowStoreModal}
        onStoreCreated={handleStoreCreated}
      />

      <SubcategoryModal 
        showModal={showSubcategoryModal}
        setShowModal={setShowSubcategoryModal}
        onSubcategoryCreated={handleSubcategoryCreated}
      />
      <SupplierModal 
        showModal={showSupplierModal}
        setShowModal={setShowSupplierModal}
        onSupplierCreated={handleSupplierCreated}
      />
    </div>
  );
};

export default AddProduct;