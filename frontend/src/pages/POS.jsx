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
  const [selectedCustomer, setSelectedCustomer] = useState('walk-in');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [orderItems, setOrderItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showPayForm, setShowPayForm] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = 5.00;
  const tax = subtotal * 0.08;
  const total = subtotal + tax - discount;

  // Fetch products and customers on component mount
  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/products');
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await api.get('/api/customers');
      // Add walk-in customer option
      setCustomers([{ id: 'walk-in', name: 'Walk-in Customer' }, ...data]);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };

  const filteredProducts = products
    .filter(product => activeCategory === 'all' || product.category === activeCategory)
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  function addToOrder(product) {
    // Check if product has sufficient stock
    if (product.qty <= 0) {
      setError(`Insufficient stock for ${product.name}`);
      return;
    }

    setOrderItems(prev => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        // Check if we're exceeding available stock
        if (exist.qty + 1 > product.qty) {
          setError(`Only ${product.qty} units available for ${product.name}`);
          return prev;
        }
        return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      } else {
        // Check if we're exceeding available stock
        if (1 > product.qty) {
          setError(`Only ${product.qty} units available for ${product.name}`);
          return prev;
        }
        return [...prev, { 
          ...product, 
          qty: 1
        }];
      }
    });
  }
  function clearAll() {
    setSelectedCustomer('walk-in');
    setSearchTerm('');
    setActiveCategory('all');
    setOrderItems([]);
    setError(null);
  }

  function removeQuantity(item) {
    setOrderItems(orderItems.map((newItem) => 
      newItem.id === item.id ? { ...newItem, quantity: newItem.quantity - 1 } : newItem
    ).filter(newItem => newItem.quantity !== 0));
  }

  const processOrder = async (paymentData) => {
    try {
      // Validate inventory before processing
      for (const item of orderItems) {
        const product = products.find(p => p.id === item.id);
        if (!product || product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}. Available: ${product ? product.quantity : 0}, Requested: ${item.quantity}`);
        }
      }

      // Prepare order data
      const orderData = {
        customerId: selectedCustomer === 'walk-in' ? null : selectedCustomer,
        userId: currentUser?.id,
        items: orderItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          discount: 0, // You can add discount logic if needed
          subtotal: item.price * item.quantity
        })),
        subtotal,
        discount,
        tax,
        total,
        paymentMethod: paymentData.method,
        amountTendered: paymentData.amountTendered,
        change: paymentData.change
      };

      // Send to backend
      const result = await api.post('/api/sales', orderData);
      
      // Update local product quantities
      const updatedProducts = products.map(product => {
        const orderedItem = orderItems.find(item => item.id === product.id);
        if (orderedItem) {
          return { ...product, quantity: product.quantity - orderedItem.quantity };
        }
        return product;
      });
      
      setProducts(updatedProducts);
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
                      <div className="text-gray-700 font-semibold">${item.price}</div>

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
                        ${(item.price * item.quantity)}
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
                {/* <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold">${subtotal}</span>
                </div> */}
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">Discount</span>
                  <span className="text-gray-700 font-semibold">-${discount}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">Tax (8%)</span>
                  <span className="font-semibold">${tax}</span>
                </div>
                <div className="border-t border-gray-400 pt-1 flex justify-between">
                  <span className="font-bold text-lg text-gray-900">Total</span>
                  <span className="font-bold text-lg text-gray-900">
                    ${total}
                  </span>
                </div>
              </div>

              {/* Payment Section */}
              <div className='flex gap-2'>
                <button onClick={clearAll} className="btn w-full mt-4 bg-red-700 text-white border-0 shadow rounded-xl py-3">
                  Clear
                </button>
                <button
                  onClick={() => setShowPayForm(true)}
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
                <button
                  className={`btn btn-sm rounded-xl px-4 py-2 ${activeCategory === 'food' ? 'bg-black text-white' : 'bg-gray-300 text-gray-900'}`}
                  onClick={() => setActiveCategory('food')}
                >
                  Food
                </button>
                <button
                  className={`btn btn-sm rounded-xl px-4 py-2 ${activeCategory === 'cold' ? 'bg-black text-white' : 'bg-gray-300 text-gray-900'}`}
                  onClick={() => setActiveCategory('cold')}
                >
                  Cold Drinks
                </button>
                <button
                  className={`btn btn-sm rounded-xl px-4 py-2 ${activeCategory === 'hot' ? 'bg-black text-white' : 'bg-gray-300 text-gray-900'}`}
                  onClick={() => setActiveCategory('hot')}
                >
                  Hot Drinks
                </button>
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
                          {/* <div className="text-xs text-gray-600">
                            150g • <span className="text-gray-600">Popular</span>
                          </div> */}
                        </div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-gray-900 font-semibold text-sm">
                          ${product.price}
                        </div>
                        <div className="flex space-x-1">
                          <span className="bg-gray-300 text-gray-900 text-[11px] px-2 py-0.5 rounded-full">
                            {product.category === 'food' ? '🍔 Food' :
                              product.category === 'cold' ? '🧊 Cold' : '☕ Hot'}
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