import { useState, useEffect, useRef, useCallback } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import CustomerForm from '../components/CustomerForm';
import PayForm from '../components/PayForm';
import Receipt from "../components/Receipt";
import { api } from '../services/api';
import { usePos } from '../hooks/usePos';

// Custom hook to get the previous value of a prop or state
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export default function POS() {
  const { currentUser } = usePos();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
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

  const prevOrderItems = usePrevious(orderItems);

  const fetchProducts = useCallback(async (storeId) => {
    if (!storeId) return;
    try {
      setLoading(true);
      const data = await api.get(`/api/products/pos?storeId=${storeId}`);
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products for the selected store');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for unlocking items when they are removed from the cart
  useEffect(() => {
    const itemsToUnlock = (prevOrderItems || []).filter(
      (prevItem) => !orderItems.some((item) => item.id === prevItem.id)
    );

    itemsToUnlock.forEach((item) => {
      api.put(`/api/products/${item.id}/lock`, { lock: false, storeId: selectedStore })
        .then(unlockedProduct => {
          // The API now returns the fully populated product. We can use it directly.
          setProducts(prev => prev.map(p => p.id === unlockedProduct.id ? unlockedProduct : p));
        })
        .catch(err => console.error(`Failed to unlock product ${item.id}`, err));
    });
  }, [orderItems, prevOrderItems, selectedStore]);

  // Effect for unlocking any remaining items on component unmount (e.g., page navigation)
  useEffect(() => {
    return () => {
      // Use a state getter to access the most recent state on unmount.
      setOrderItems(currentOrderItems => {
        currentOrderItems.forEach((item) => {
          api.put(`/api/products/${item.id}/lock`, { lock: false, storeId: selectedStore })
            .catch(err => console.error(`Failed to unlock product ${item.id} on unmount`, err));
        });
        return currentOrderItems; // Return state unchanged
      });
    };
  }, [selectedStore]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const fetchedCustomers = await api.get('/api/customers');
        setCustomers(fetchedCustomers);
        
        if (fetchedCustomers) {
          const walkInCustomer = fetchedCustomers.find(c => c.name === 'Walk-in Customer');
          setSelectedCustomer(walkInCustomer ? walkInCustomer.id : (fetchedCustomers[0]?.id || null));
        }

        const fetchedCategories = await api.get('/api/categories');
        setCategories(fetchedCategories);

        const fetchedStores = await api.get('/api/stores');
        setStores(fetchedStores);
        if (fetchedStores && fetchedStores.length > 0) {
          const initialStoreId = fetchedStores[0].id;
          setSelectedStore(initialStoreId);
          // Initial fetch is handled by the store change effect
        } else {
          setError('No stores found. Please add a store.');
        }
      } catch (err) {
        setError('Failed to load initial data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []); // Removed fetchProducts from dependency array

  // Re-fetch products when store changes
  useEffect(() => {
    if (selectedStore) {
      fetchProducts(selectedStore);
    }
  }, [selectedStore, fetchProducts]);

  const filteredProducts = products
    .filter(product => activeCategory === 'all' || product.category === activeCategory)
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const addToOrder = useCallback(async (product) => {
    if (orderItems.some(item => item.id === product.id)) {
      setError(`"${product.name}" is already in the cart. Use the "+" button to increase quantity.`);
      return;
    }

    try {
      // The backend now returns the fully populated product on success
      const lockedProduct = await api.put(`/api/products/${product.id}/lock`, { 
        lock: true, 
        storeId: selectedStore 
      });

      const variant = lockedProduct.ProductVariants?.[0];
      if (!variant) {
        throw new Error(`No variants available for ${lockedProduct.name}.`);
      }
      
      if (variant.qty <= 0) {
        // If no stock, we must release the lock we just acquired.
        await api.put(`/api/products/${lockedProduct.id}/lock`, { lock: false, storeId: selectedStore });
        throw new Error(`Insufficient stock for ${lockedProduct.name}`);
      }
      
      // The lock was successful, update the UI with the rich data from the server
      setProducts(prevProducts => prevProducts.map(p => 
        p.id === lockedProduct.id ? lockedProduct : p
      ));

      // Add to cart
      setOrderItems(prev => [...prev, { 
        ...lockedProduct,
        quantity: 1,
        variantId: variant.id,
        unitPrice: variant.price,
        price: variant.price
      }]);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Error adding "${product.name}"`;
      setError(errorMessage);
      // NOTE: We no longer fetch all products here, as it was the source of the flicker.
      // The error message should be enough feedback for the user.
    }
  }, [orderItems, selectedStore]);

  function addQuantity(item) {
    setOrderItems(prev => prev.map(i => 
      i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
    ));
  }

  function removeQuantity(item) {
    setOrderItems(orderItems.map((newItem) => 
      newItem.id === item.id ? { ...newItem, quantity: newItem.quantity - 1 } : newItem
    ).filter(newItem => newItem.quantity !== 0));
  }

  function clearAll() {
    setOrderItems([]);
    setError(null);
    setDiscount(0.00);
  }

  const processOrder = async (paymentData) => {
    try {
      if (!selectedStore || !selectedCustomer) {
        throw new Error('Store and Customer must be selected');
      }

      const orderData = {
        ...paymentData,
        orderItems: orderItems.map(item => ({
          productId: item.id,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.price * item.quantity,
        })),
        customerId: selectedCustomer,
        storeId: selectedStore,
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        total: total,
      };

      const result = await api.post('/api/sales', orderData);
      
      // On successful order, the useEffect will handle unlocking as orderItems is cleared.
      setShowReceipt(true);
      return result;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to process order');
      // If order fails, items remain in cart and remain locked by user.
      throw err;
    }
  };

  if (loading) return <div className="p-6">Loading products...</div>;

  const isProductLocked = (product) => {
    const twoMinutes = 2 * 60 * 1000;
    return product.isLocked && (new Date() - new Date(product.lockedAt)) < twoMinutes;
  }

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
              {/* Store Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h2 className="font-semibold text-gray-700">Store</h2>
                </div>
                <select
                  className="select select-bordered w-full bg-white rounded-xl p-2 border border-gray-400"
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  disabled={stores.length === 0}
                >
                  {stores.length > 0 ? (
                    stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No stores available</option>
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
                  {filteredProducts.map((product) => {
                    const locked = isProductLocked(product);
                    return (
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
                          <button onClick={() => addToOrder(product)} 
                            className={`w-full flex justify-center items-center py-1.5 text-white text-sm rounded-lg shadow ${locked ? 'bg-gray-400 cursor-not-allowed' : 'bg-black'}`}
                            disabled={locked}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            {locked ? 'Locked' : 'Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )})}
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