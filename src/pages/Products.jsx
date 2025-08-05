import React, { useState } from 'react';
import ProductList from '../components/ProductList';

// Enhanced dummy products with more realistic data
export const dummyProducts = [
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
    createdByAvatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" 
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
    createdByAvatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" 
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
    createdByAvatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" 
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
    createdByAvatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" 
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
    createdByAvatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" 
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
    createdByAvatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" 
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
    createdByAvatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" 
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
    createdByAvatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" 
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
    createdByAvatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" 
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
    createdByAvatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" 
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
    createdByAvatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" 
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
    createdByAvatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" 
  },
  {
    id: 13,
    code: "FD013",
    name: "Cappuccino",
    category: "hot",
    brand: "CafeCo",
    price: 4.25,
    unit: "Pc",
    qty: 85,
    image: "./src/assets/img/cappuccino.png",
    createdBy: "Manager",
    createdByAvatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
  },
  {
    id: 14,
    code: "FD014",
    name: "Mocha",
    category: "hot",
    brand: "CafeCo",
    price: 4.75,
    unit: "Pc",
    qty: 90,
    image: "./src/assets/img/mocha.png",
    createdBy: "Manager",
    createdByAvatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
  },
  {
    id: 15,
    code: "FD015",
    name: "Espresso",
    category: "hot",
    brand: "CafeCo",
    price: 3.25,
    unit: "Pc",
    qty: 75,
    image: "./src/assets/img/espresso.png",
    createdBy: "Admin",
    createdByAvatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
  },
  {
    id: 16,
    code: "FD016",
    name: "Iced Coffee",
    category: "cold",
    brand: "CafeCo",
    price: 4.50,
    unit: "Pc",
    qty: 65,
    image: "./src/assets/img/iced-coffee.png",
    createdBy: "Barista",
    createdByAvatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
  },
  {
    id: 17,
    code: "FD017",
    name: "Fruit Smoothie",
    category: "cold",
    brand: "CafeCo",
    price: 5.25,
    unit: "Pc",
    qty: 55,
    image: "./src/assets/img/fruit-smoothie.png",
    createdBy: "Barista",
    createdByAvatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
  },
  {
    id: 18,
    code: "FD018",
    name: "Blueberry Muffin",
    category: "food",
    brand: "CafeCo",
    price: 3.25,
    unit: "Pc",
    qty: 45,
    image: "./src/assets/img/blueberry-muffin.png",
    createdBy: "Admin",
    createdByAvatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
  },
  {
    id: 19,
    code: "FD019",
    name: "Chocolate Chip Cookie",
    category: "food",
    brand: "CafeCo",
    price: 2.25,
    unit: "Pc",
    qty: 120,
    image: "./src/assets/img/chocolate-chip-cookie.png",
    createdBy: "Manager",
    createdByAvatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
  },
  {
    id: 20,
    code: "FD020",
    name: "Bagel with Cream Cheese",
    category: "food",
    brand: "CafeCo",
    price: 3.75,
    unit: "Pc",
    qty: 70,
    image: "./src/assets/img/bagel.png",
    createdBy: "Barista",
    createdByAvatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
  },
];

export default function Products() {
  const [products] = useState(dummyProducts);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ProductList products={products} />
      
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-semibold">Add New Product</h3>
              <button 
                onClick={() => setShowForm(false)} 
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              {/* Form content would go here */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Food</option>
                    <option>Hot Drinks</option>
                    <option>Cold Drinks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}