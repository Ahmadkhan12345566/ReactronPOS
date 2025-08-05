import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import CustomerForm from '../components/CustomerForm';
import PayForm from '../components/PayForm';
import Receipt from "../components/Receipt";
// ————————————————————————
// Products (centralized “dummyProducts”)
// ————————————————————————
export const products = [
  {
    id:  1,
    code: "FD001",
    name: "Beef Burger",
    category: "food",
    brand: "CafeCo",
    price: 7.0,
    unit: "Pc",
    qty: 100,
    image: "./src/assets/img/beef-burger.png",
    createdBy: "Admin",
    createdByAvatar: "./src/assets/img/users/user-default.jpg"
  },
  {
    id:  2,
    code: "FD002",
    name: "Choco Glaze Donut Peanut",
    category: "food",
    brand: "CafeCo",
    price: 3.25,
    unit: "Pc",
    qty: 100,
    image: "./src/assets/img/choco-glaze-donut-peanut.png",
    createdBy: "Admin",
    createdByAvatar: "./src/assets/img/users/user-default.jpg"
  },
  {
    id:  3,
    code: "FD003",
    name: "Choco Glaze Donut",
    category: "food",
    brand: "CafeCo",
    price: 2.75,
    unit: "Pc",
    qty: 100,
    image: "./src/assets/img/choco-glaze-donut.png",
    createdBy: "Admin",
    createdByAvatar: "./src/assets/img/users/user-default.jpg"
  },
  {
    id:  4,
    code: "FD004",
    name: "Cinnamon Roll",
    category: "food",
    brand: "CafeCo",
    price: 3.5,
    unit: "Pc",
    qty: 100,
    image: "./src/assets/img/cinnamon-roll.png",
    createdBy: "Admin",
    createdByAvatar: "./src/assets/img/users/user-default.jpg"
  },
  {
    id:  5,
    code: "FD005",
    name: "Coffee Latte",
    category: "hot",
    brand: "CafeCo",
    price: 4.0,
    unit: "Pc",
    qty: 100,
    image: "./src/assets/img/coffee-latte.png",
    createdBy: "Admin",
    createdByAvatar: "./src/assets/img/users/user-default.jpg"
  },
  {
    id:  6,
    code: "FD006",
    name: "Croissant",
    category: "food",
    brand: "CafeCo",
    price: 2.5,
    unit: "Pc",
    qty: 100,
    image: "./src/assets/img/croissant.png",
    createdBy: "Admin",
    createdByAvatar: "./src/assets/img/users/user-default.jpg"
  },
  {
    id:  7,
    code: "FD007",
    name: "Ice Chocolate",
    category: "cold",
    brand: "CafeCo",
    price: 4.25,
    unit: "Pc",
    qty: 100,
    image: "./src/assets/img/ice-chocolate.png",
    createdBy: "Admin",
    createdByAvatar: "./src/assets/img/users/user-default.jpg"
  },
  {
    id:  8,
    code: "FD008",
    name: "Ice Tea",
    category: "cold",
    brand: "CafeCo",
    price: 1.99,
    unit: "Pc",
    qty: 100,
    image: "./src/assets/img/ice-tea.png",
    createdBy: "Admin",
    createdByAvatar: "./src/assets/img/users/user-default.jpg"
  },
  {
    id:  9,
    code: "FD009",
    name: "Matcha Latte",
    category: "hot",
    brand: "CafeCo",
    price: 4.5,
    unit: "Pc",
    qty: 100,
    image: "./src/assets/img/matcha-latte.png",
    createdBy: "Admin",
    createdByAvatar: "./src/assets/img/users/user-default.jpg"
  },
  {
    id: 10,
    code: "FD010",
    name: "Sandwich",
    category: "food",
    brand: "CafeCo",
    price: 5.5,
    unit: "Pc",
    qty: 100,
    image: "./src/assets/img/sandwich.png",
    createdBy: "Admin",
    createdByAvatar: "./src/assets/img/users/user-default.jpg"
  },
  {
    id: 11,
    code: "FD011",
    name: "Sawarma",
    category: "food",
    brand: "CafeCo",
    price: 6.75,
    unit: "Pc",
    qty: 100,
    image: "./src/assets/img/sawarma.png",
    createdBy: "Admin",
    createdByAvatar: "./src/assets/img/users/user-default.jpg"
  },
  {
    id: 12,
    code: "FD012",
    name: "Red Glaze Donut",
    category: "food",
    brand: "CafeCo",
    price: 2.95,
    unit: "Pc",
    qty: 100,
    image: "./src/assets/img/red-glaze-donut.png",
    createdBy: "Admin",
    createdByAvatar: "./src/assets/img/users/user-default.jpg"
  }
];

// ————————————————————————
// Customers (unchanged)
// ————————————————————————
export const customers = [
  { id: 'walk-in',   name: 'Walk-in Customer' },
  { id: 'cust-001',  name: 'John Smith (VIP)',    phone: '555-1234' },
  { id: 'cust-002',  name: 'Sarah Johnson',        phone: '555-5678' },
  { id: 'cust-003',  name: 'Mike Wilson',          phone: '555-9012' },
  { id: 'cust-004',  name: 'Emily Davis',          phone: '555-3456' },
];

export default function POS() {
  const [customersList, setCustomersList] = useState(customers);
  const [selectedCustomer, setSelectedCustomer] = useState('walk-in');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [orderItems, setOrderItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showPayForm, setShowPayForm] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = 5.00;
  const tax = subtotal * 0.08;
  const total = subtotal + tax - discount;

  const filteredProducts = products
    .filter(product => activeCategory === 'all' || product.category === activeCategory)
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  function addToOrder(product) {
    setOrderItems(prev => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      else return [...prev, { ...product, qty: 1 }];
    })
  };

  function clearAll() {
    setSelectedCustomer(() => 'walk-in');
    setSearchTerm(() => '');
    setActiveCategory(() => 'all');
    setOrderItems(() => []);
  }

  function addQuantity(item) {
    setOrderItems(orderItems.map((newItem) => newItem.id === item.id ? { ...newItem, qty: newItem.qty + 1 } : newItem));
  }

  function removeQuantity(item) {
    setOrderItems(orderItems.map((newItem) => newItem.id === item.id ? { ...newItem, qty: newItem.qty - 1 } : newItem)
      .filter(newItem => newItem.qty !== 0));
  }

  return (
    <div className="overflow-auto flex-1 bg-gray-100 p-4">
      <div className="mx-auto flex flex-col lg:flex-row gap-6 h-[630px]">
        {/* Order Section - Left Side */}
        <div className="w-full lg:w-[27.5%] bg-white rounded-2xl border border-gray-400 shadow-lg flex flex-col">
          <div className="p-6 flex flex-col flex-1 overflow-hidden">
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
                  {customersList.map((customer) => (
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
                    <div className="text-gray-700 font-semibold">${item.price.toFixed(2)}</div>

                    {/* Qty Controls */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => removeQuantity(item)}
                        className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full text-lg"
                      >
                        –
                      </button>
                      <span className="font-semibold">{item.qty}</span>
                      <button
                        onClick={() => addQuantity(item)}
                        className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full text-lg"
                      >
                        +
                      </button>
                    </div>


                    {/* Subtotal */}
                    <div className="text-gray-700 font-semibold">
                      ${(item.price * item.qty).toFixed(2)}
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
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div> */}
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">Discount</span>
                <span className="text-gray-700 font-semibold">-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">Tax (8%)</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-400 pt-1 flex justify-between">
                <span className="font-bold text-lg text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">
                  ${total.toFixed(2)}
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
        <div className="w-full lg:w-[72.5%] bg-white rounded-2xl border border-gray-400 shadow-lg flex flex-col">
          <div className="p-6 flex flex-col flex-1 overflow-hidden">
            {/* Categories */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
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
                        ${product.price.toFixed(2)}
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
            setCustomersList(prev => [...prev, customer]);
            setSelectedCustomer(customer.id);
          }}
          
        />
      )}

          {showPayForm && (
          <PayForm 
            isOpen={showPayForm}
            onClose={() => setShowPayForm(false)}
            total={total}
            onPaySubmit={(paymentData) => {
              console.log('Payment data:', paymentData);
              setShowPayForm(false); // Close payment form
              setShowReceipt(true);  // Show receipt
            }}
          />
        )}
        {showReceipt && (
          <Receipt
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          customerName={
            customersList.find(c => c.id === selectedCustomer)?.name
          }
          customerId={selectedCustomer}
          orderItems={orderItems}
          subtotal={subtotal}
          discount={discount}
          tax={tax}
          total={total}
        />
        )}
    </div>
  );
}