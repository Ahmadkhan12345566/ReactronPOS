import React, { useState, useEffect } from 'react';
import Accordion from '../components/forms/Accordion';
import PageHeader from '../components/forms/PageHeader';
import FormFooter from '../components/forms/FormFooter';
import { useNavigate } from 'react-router-dom';
import SupplierModal from '../components/forms/SupplierModal';
import { api } from '../services/api';
import { usePos } from '../hooks/usePos';
import {
  ArrowPathIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  PlusCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AddPurchase = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [accordion, setAccordion] = useState({
    purchaseInfo: true,
    purchaseItems: false
  });
  const { currentUser } = usePos();
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
  try {
    const [suppliersResponse, productsResponse, storesResponse] = await Promise.all([
      api.get('/api/suppliers'),
      api.get('/api/products'), 
      api.get('/api/stores')
    ]);
    console.log(productsResponse);
    setSuppliers(suppliersResponse);
    setProducts(productsResponse);
    setStores(storesResponse);
  } catch (error) {
    console.error('Error fetching options:', error);
  }
};
  const handleSupplierCreated = (newSupplier) => {
    setSuppliers(prevSuppliers => [...prevSuppliers, newSupplier]);
    setShowSupplierModal(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Calculate totals from purchase items
      let subtotal = 0;
      const items = purchaseItems.map((item, index) => {
        const quantity = parseFloat(data[`quantity_${index}`]) || 0;
        const unitPrice = parseFloat(data[`unitPrice_${index}`]) || 0;
        const itemTotal = quantity * unitPrice;
        subtotal += itemTotal;
        
        return {
          productId: item.productId,
          variantId: item.variantId,
          storeId: item.storeId,
          quantity: quantity,
          unitPrice: unitPrice,
          subtotal: itemTotal
        };
      });

      const total = subtotal;
      const paid = parseFloat(data.paid) || 0;
      const due = total - paid;
      
      const purchaseData = {
        reference: data.reference,
        date: data.date || new Date().toISOString().split('T')[0],
        status: data.status || 'Received',
        payment_status: data.payment_status || 'Unpaid',
        total: total,
        paid: paid,
        due: due,
        supplierId: data.supplierId,
        purchaseItems: items
      };
      
      console.log('Purchase data to send:', purchaseData);
      await api.post('/api/purchases', purchaseData);
      navigate('/purchases');
    } catch (error) {
      console.error('Error creating purchase:', error);
    }
  };

  const toggleAccordion = (section) => {
    setAccordion(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addPurchaseItem = () => {
    setPurchaseItems([...purchaseItems, { 
      productId: '', 
      variantId: '', 
      storeId: stores[0]?.id || '', 
      quantity: 1, 
      unitPrice: 0 
    }]);
  };

  const removePurchaseItem = (index) => {
    const newItems = [...purchaseItems];
    newItems.splice(index, 1);
    setPurchaseItems(newItems);
  };

  const updatePurchaseItem = (index, field, value) => {
    const newItems = [...purchaseItems];
    newItems[index][field] = value;
    
    // If product changes, auto-select the first variant
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product && product.ProductVariants && product.ProductVariants.length > 0) {
        newItems[index].variantId = product.ProductVariants[0].id;
      } else {
        newItems[index].variantId = '';
      }
    }
    
    setPurchaseItems(newItems);
  };

  const getProductVariants = (productId) => {
    const product = products.find(p => p.id === productId);
    return product?.ProductVariants || [];
  };

  const calculateDueAmount = (e) => {
    const form = e.target.form;
    const total = parseFloat(form.total?.value) || 0;
    const paid = parseFloat(form.paid?.value) || 0;
    if (form.due) {
      form.due.value = (total - paid).toFixed(2);
    }
  };

  // Calculate total from purchase items
  const calculateTotal = () => {
    return purchaseItems.reduce((total, item, index) => {
      const quantity = parseFloat(document.querySelector(`[name="quantity_${index}"]`)?.value) || 0;
      const unitPrice = parseFloat(document.querySelector(`[name="unitPrice_${index}"]`)?.value) || 0;
      return total + (quantity * unitPrice);
    }, 0);
  };

  // Update total when purchase items change
  useEffect(() => {
    const total = calculateTotal();
    const totalInput = document.querySelector('[name="total"]');
    const paidInput = document.querySelector('[name="paid"]');
    const dueInput = document.querySelector('[name="due"]');
    
    if (totalInput) totalInput.value = total.toFixed(2);
    if (dueInput && paidInput) {
      const paid = parseFloat(paidInput.value) || 0;
      dueInput.value = (total - paid).toFixed(2);
    }
  }, [purchaseItems]);

  return (
    <div className="bg-gray-50 flex flex-col h-full p-6">
      <PageHeader 
        title="Create Purchase"
        subtitle="Create new purchase order"
        backPath="/purchases"
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
            title="Purchase Information"
            icon={InformationCircleIcon}
            isOpen={accordion.purchaseInfo}
            onToggle={() => toggleAccordion('purchaseInfo')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference <span className="text-red-500">*</span>
                </label>
                <input 
                  name="reference"
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter reference number"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input 
                  name="date"
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                {/* <-- 4. ADD "ADD NEW" BUTTON --> */}
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier <span className="text-red-500">*</span>
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
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
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
                  <option value="Received">Received</option>
                  <option value="Pending">Pending</option>
                  <option value="Ordered">Ordered</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount
                </label>
                <input 
                  name="total"
                  type="number" 
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                  placeholder="0.00"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paid Amount
                </label>
                <input 
                  name="paid"
                  type="number" 
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  defaultValue="0"
                  onChange={calculateDueAmount}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Amount
                </label>
                <input 
                  name="due"
                  type="number" 
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                  placeholder="0.00"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status <span className="text-red-500">*</span>
                </label>
                <select 
                  name="payment_status" 
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
          </Accordion>

          <Accordion 
            title="Purchase Items"
            icon={InformationCircleIcon}
            isOpen={accordion.purchaseItems}
            onToggle={() => toggleAccordion('purchaseItems')}
          >
            <div className="mb-4">
              <button 
                type="button" 
                className="flex items-center text-black text-sm p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                onClick={addPurchaseItem}
              >
                <PlusCircleIcon className="w-4 h-4 mr-1" />
                Add Item
              </button>
            </div>
            
            {purchaseItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchaseItems.map((item, index) => {
                      const variants = getProductVariants(item.productId);
                      console.log('Available variants:', variants); // Debug log
                      
                      return (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <select 
                              className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                              value={item.productId}
                              onChange={(e) => updatePurchaseItem(index, 'productId', e.target.value)}
                              required
                            >
                              <option value="">Select Product</option>
                              {products.map(product => (
                                <option key={product.id} value={product.id}>
                                  {product.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          
                          <td className="px-4 py-3">
                            <select 
                              className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                              value={item.variantId}
                              onChange={(e) => updatePurchaseItem(index, 'variantId', e.target.value)}
                              required
                              disabled={!item.productId || variants.length === 0}
                            >
                              <option value="">Select Variant</option>
                              {variants.map(variant => (
                                <option key={variant.id} value={variant.id}>
                                  {variant.sku || `Variant ${variant.id}`} (${variant.price})
                                </option>
                              ))}
                            </select>
                            {variants.length === 0 && item.productId && (
                              <p className="text-xs text-red-500 mt-1">No variants available for this product</p>
                            )}
                          </td>
                          
                          <td className="px-4 py-3">
                            <select 
                              className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                              value={item.storeId}
                              onChange={(e) => updatePurchaseItem(index, 'storeId', e.target.value)}
                              required
                            >
                              {stores.map(store => (
                                <option key={store.id} value={store.id}>{store.name}</option>
                              ))}
                            </select>
                          </td>
                          
                          <td className="px-4 py-3">
                            <input 
                              name={`quantity_${index}`}
                              type="number" 
                              className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                              min="1"
                              defaultValue="1"
                              required
                            />
                          </td>
                          
                          <td className="px-4 py-3">
                            <input 
                              name={`unitPrice_${index}`}
                              type="number" 
                              className="w-full px-2 py-1 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                              step="0.01"
                              min="0"
                              required
                            />
                          </td>
                          
                          <td className="px-4 py-3">
                            <input 
                              type="text" 
                              className="w-full px-2 py-1 border border-gray-600 rounded bg-gray-100"
                              readOnly
                              value={(() => {
                                const quantity = parseFloat(document.querySelector(`[name="quantity_${index}"]`)?.value) || 0;
                                const unitPrice = parseFloat(document.querySelector(`[name="unitPrice_${index}"]`)?.value) || 0;
                                return (quantity * unitPrice).toFixed(2);
                              })()}
                            />
                          </td>
                          
                          <td className="px-4 py-3">
                            <button 
                              type="button" 
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              onClick={() => removePurchaseItem(index)}
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No items added yet. Click "Add Item" to get started.
              </div>
            )}
          </Accordion>
        </div>

        <FormFooter 
          cancelPath="/purchases" 
          submitLabel="Add Purchase" 
          disabled={currentUser.role !== 'admin'}
        />
      </form>
      <SupplierModal 
        showModal={showSupplierModal}
        setShowModal={setShowSupplierModal}
        onSupplierCreated={handleSupplierCreated}
      />
    </div>
  );
};

export default AddPurchase;