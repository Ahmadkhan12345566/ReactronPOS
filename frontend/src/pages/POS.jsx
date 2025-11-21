import { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import CustomerForm from '../components/CustomerForm';
import PayForm from '../components/PayForm';
import Receipt from "../components/Receipt";
import { api } from '../services/api';
import { usePos } from '../context/PosContext';

export default function POS() {
  const { currentUser } = usePos();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [warehouses, setWarehouses] = useState([]); // Add warehouses state
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [orderItems, setOrderItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showPayForm, setShowPayForm] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [discount, setDiscount] = useState(0.00); 
  const tax = subtotal * 0.08;
  const total = subtotal + tax - discount;

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const fetchedCustomers = await fetchCustomers();
        
        if (fetchedCustomers) {
          const walkInCustomer = fetchedCustomers.find(c => c.name === 'Walk-in Customer');
          if (walkInCustomer) {
            setSelectedCustomer(walkInCustomer.id);
          } else if (fetchedCustomers.length > 0) {
            // Fallback to the first customer if walk-in not found
            setSelectedCustomer(fetchedCustomers[0].id);
          } else {
            setError('No customers found. Please add a customer.');
          }
        }

        await fetchCategories();
        const fetchedWarehouses = await fetchWarehouses();
        if (fetchedWarehouses && fetchedWarehouses.length > 0) {
          const initialWarehouseId = fetchedWarehouses[0].id;
          setSelectedWarehouse(initialWarehouseId);
          await fetchProducts(initialWarehouseId);
        } else {
          setError('No warehouses found. Please add a warehouse.');
        }
      } catch (err) {
        setError('Failed to load initial data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Re-fetch products when warehouse changes
  useEffect(() => {
    if (selectedWarehouse) {
      fetchProducts(selectedWarehouse);
    }
  }, [selectedWarehouse]);


  const fetchProducts = async (warehouseId) => {
    if (!warehouseId) return;
    try {
      setLoading(true);
      const data = await api.get(`/api/products/pos?warehouseId=${warehouseId}`);
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products for the selected warehouse');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await api.get('/api/customers');
      setCustomers(data);
      return data; // Return data for chaining
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      return null; // Return null on error
    }
  };

  const fetchWarehouses = async () => {
    try {
      const data = await api.get('/api/warehouses');
      setWarehouses(data);
      return data; // Return data for chaining
    } catch (err) {
      console.error('Failed to fetch warehouses:', err);
      setError('Failed to load warehouses');
      return null; // Return null on error
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.get('/api/categories');
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const filteredProducts = products
    .filter(product => activeCategory === 'all' || product.category === activeCategory)
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  function addQuantity(item) {
    const product = products.find(p => p.id === item.id);
    if (product) {
      addToOrder(product);
    }
  }

  // Update the addToOrder function
  function addToOrder(product) {
    // Check if product has variants
    if (!product.ProductVariants || product.ProductVariants.length === 0) {
      setError(`No variants available for ${product.name}. Please add a variant in the product management.`);
      return;
    }

    // Use the first variant for now
    const variant = product.ProductVariants[0];
    
    // The backend now sends the correct qty for the selected warehouse
    const availableQty = variant.Inventories[0]?.qty || 0;

    if (availableQty <= 0) {
      setError(`Insufficient stock for ${product.name}`);
      return;
    }

    setOrderItems(prev => {
      const exist = prev.find((item) => item.id === product.id && item.variantId === variant.id);
      if (exist) {
        if (exist.quantity + 1 > availableQty) {
          setError(`Only ${availableQty} units available for ${product.name}`);
          return prev;
        }
        return prev.map((item) => 
          item.id === product.id && item.variantId === variant.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        if (1 > availableQty) {
          setError(`Only ${availableQty} units available for ${product.name}`);
          return prev;
        }
        return [...prev, { 
          ...product, 
          variantId: variant.id,
          quantity: 1,
          unitPrice: variant.price,
          price: variant.price // Keep for UI compatibility
        }];
      }
    });
  }

  // Update the removeQuantity function
  function removeQuantity(item) {
    setOrderItems(orderItems.map((newItem) => 
      newItem.id === item.id ? { ...newItem, quantity: newItem.quantity - 1 } : newItem
    ).filter(newItem => newItem.quantity !== 0));
  }

  function clearAll() {
    const walkInCustomer = customers.find(c => c.name === 'Walk-in Customer');
    if (walkInCustomer) {
      setSelectedCustomer(walkInCustomer.id);
    }
    setSearchTerm('');
    setActiveCategory('all');
    setOrderItems([]);
    setError(null);
    setDiscount(0.00);
  }

  // Update the processOrder function to include warehouse
  const processOrder = async (paymentData) => {
    try {
      // Validate warehouse selection
      if (!selectedWarehouse) {
        throw new Error('Warehouse selection is required');
      }

      // Get the actual customer ID (not the string 'walk-in')
      const customerId = selectedCustomer;

      if (!customerId) {
        throw new Error('No valid customer selected');
      }

      // Prepare order data matching Sale model structure
      const orderData = {
        reference: `POS-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed',
        payment_status: 'Paid',
        payment_method: paymentData.method,
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        shipping: 0,
        total: total,
        paid: paymentData.amountTendered,
        due: 0,
        note: paymentData.saleNote || '',
        customerId: customerId,
        userId: currentUser?.id,
        warehouseId: parseInt(selectedWarehouse), // Use selectedWarehouse from state
        orderItems: orderItems.map(item => ({
          productId: item.id,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.unitPrice * item.quantity
        }))
      };

      const result = await api.post('/api/sales', orderData);
      
      // Re-fetch products to get updated quantities
      await fetchProducts(selectedWarehouse);

      setShowReceipt(true);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to process order');
      throw err;
    }
  };

  if (loading) return <div className="p-6">Loading products...</div>;

  return (
    <div className="h-full overflow-auto flex-1 bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <button onClick={() => setError(null)} className="absolute top-0 right-0 p-2">
            <span className="text-red-700">×</span>
          </button>
        </div>
      )}
      
      <div className="mx-auto flex flex-col lg:flex-row gap-6 h-full">
        {/* Order Section - Left Side */}
        <div className="w-full lg:w-[27.5%] h-full bg-white rounded-2xl border border-gray-800 shadow-lg flex flex-col">
            <div className="p-6 flex flex-col flex-1 overflow-hidden min-h-0">
              {/* Warehouse Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h2 className="font-semibold text-gray-700">Warehouse</h2>
                </div>
                <select
                  className="select select-bordered w-full bg-white rounded-xl p-2 border border-gray-400"
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  disabled={warehouses.length === 0}
                >
                  {warehouses.length > 0 ? (
                    warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No warehouses available</option>
                  )}
                </select>
              </div>

              {/* Customer Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h2 className="font-semibold text-gray-700">Customer</h2>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <select
                    className="select select-bordered flex-1 bg-white rounded-xl p-1 border border-gray-400"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                  >
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} {customer.phone ? `(${customer.phone})` : ''}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => setShowCustomerForm(true)} className="btn btn-xs bg-black text-white border-0 rounded-lg px-3 py-1">
                    Add New
                  </button>
                </div>
              </div>

              {/* Product Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search products…"
                  className="w-full border border-black p-2"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onFocus={() => setIsOpen(true)}
                  onBlur={() => {
                    // delay closing until after click
                    setTimeout(() => setIsOpen(false), 100);
                  }}
                />

                {isOpen && (
                  <ul className="absolute z-10 w-full max-h-48 overflow-auto border border-black bg-white">
                    {products
                      // always show all when searchTerm is empty
                      .filter(p =>
                        p.name.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(p => (
                        <li
                          key={p.id}
                          className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                          onMouseDown={() => {
                            addToOrder(p);
                            setSearchTerm('');
                          }}
                        >
                          {p.name}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              {/* Order Items */}
              <div className="mb-2 flex-1 overflow-y-auto">
                {/* Header Row */}
                <div className="grid grid-cols-[3fr_0.2fr_1.5fr_1fr_auto] gap-1 text-xs text-gray-500 mb-1 px-1">
                  <span>Product</span>
                  <span>Price</span>
                  <span className="text-center">Qty</span>
                  <span>Subtotal</span>
                  <span className="text-right"><TrashIcon className='w-5 h-5' /></span>
                </div>

                {/* Order Item Rows */}
                <div className="space-y-1.5">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[3fr_0.2fr_1.5fr_1fr_auto] items-center gap-1 px-1 py-1.5 rounded-md bg-white border border-gray-200 text-xs"
                    >
                      {/* Product Name */}
                      <div className="font-semibold text-gray-800 truncate text-sm">
                        {item.name}
                      </div>

                      {/* Price */}
                      <div className="text-gray-700 font-semibold">PKR {item.price}</div>

                      {/* quantity Controls */}
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => removeQuantity(item)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full text-lg"
                        >
                          –
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => addQuantity(item)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full text-lg"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-gray-700 font-semibold">
                        PKR {(item.price * item.quantity)}
                      </div>

                      {/* Delete Icon */}
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            setOrderItems((prev) =>
                              prev.filter((i) => i.id !== item.id)
                            )
                          }
                          className="text-red-500 hover:text-red-700"
                          title="Remove item"
                        >
                          <TrashIcon className='w-5 h-5' />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="px-4 py-2 rounded-xl bg-white border border-gray-400">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700">Discount</span>
                  <input
                    type="number"
                    className="w-24 text-right font-semibold text-gray-700 border border-gray-300 rounded-md px-2 py-0.5"
                    value={discount.toFixed(2)}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    onFocus={(e) => e.target.select()} // Select all text on click
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">Tax (8%)</span>
                  <span className="font-semibold">PKR {tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-400 pt-1 flex justify-between">
                  <span className="font-bold text-lg text-gray-900">Total</span>
                  <span className="font-bold text-lg text-gray-900">
                    PKR {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Section */}
              <div className='flex gap-2'>
                <button onClick={clearAll} className="btn w-full mt-4 bg-red-700 text-white border-0 shadow rounded-xl py-3">
                  Clear
                </button>
                <button
                  onClick={() => {
                    if (orderItems.length === 0) {
                      setError('Please add items to the order first.');
                      return;
                    }
                    setShowPayForm(true);
                  }}
                  className="btn w-full mt-4 bg-black text-white border-0 shadow rounded-xl py-3"
                >
                  Pay
                </button>
              </div>
            </div>
          </div>

          {/* Products Section - Right Side */}
        <div className="w-full lg:w-[72.5%] h-full bg-white rounded-2xl border border-gray-800 shadow-lg flex flex-col">
            <div className="p-6 flex flex-col flex-1 overflow-hidden">
              {/* Categories */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 min-h-0">
                <button
                  className={`btn btn-sm rounded-xl px-4 py-2 ${activeCategory === 'all' ? 'bg-black text-white' : 'bg-gray-300 text-gray-900'}`}
                  onClick={() => setActiveCategory('all')}
                >
                  All items
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`btn btn-sm rounded-xl px-4 py-2 ${activeCategory === category.name ? 'bg-black text-white' : 'bg-gray-300 text-gray-900'}`}
                    onClick={() => setActiveCategory(category.name)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col p-0 rounded-xl bg-white border border-gray-400 hover:shadow transition-all overflow-hidden"
                    >
                      {/* Product Image */}
                      <div className="h-[75%] overflow-hidden">
                        <div className="bg-gray-200 w-full h-full flex justify-center items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                        
                      </div>
                      {/* Product Info */}
                      <div className="flex flex-col flex-shrink-0 px-4 justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 truncate">
                            {product.name}
                          </h3>
                        </div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-gray-900 font-semibold text-sm">
                          PKR {product.price}
                        </div>
                        <div className="flex space-x-1">
                          <span className="bg-gray-300 text-gray-900 text-[11px] px-2 py-0.5 rounded-full">
                            {product.category}
                          </span>
                        </div>
                        
                      </div>
                      {/* Add Button */}
                        <div className="my-2">
                          <button onClick={() => addToOrder(product)} className="w-full flex justify-center items-center py-1.5 bg-black text-white text-sm rounded-lg shadow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      {showCustomerForm && (
        <CustomerForm 
          isOpen={showCustomerForm}
          onClose={() => setShowCustomerForm(false)}
          onAddCustomer={(customer) => {
            setCustomers(prev => [...prev, customer]);
            setSelectedCustomer(customer.id);
          }}
        />
      )}

      {showPayForm && (
        <PayForm 
          isOpen={showPayForm}
          onClose={() => setShowPayForm(false)}
          total={total}
          onPaySubmit={processOrder}
        />
      )}

      {showReceipt && (
        <Receipt
          isOpen={showReceipt}
          onClose={() => {
            setShowReceipt(false);
            clearAll();
          }}
          customerName={
            customers.find(c => c.id === selectedCustomer)?.name || 'Walk-in Customer'
          }
          customerId={selectedCustomer}
          orderItems={orderItems}
          subtotal={subtotal}
          discount={discount}
          tax={tax}
          total={total}
          biller={currentUser?.name || 'System'}
        />
      )}
    </div>
  );
}