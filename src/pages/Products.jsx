import React, { useState } from 'react';

import ProductList from '../components/ProductList';

const dummyProducts = [
  { id: 1, name: "Wireless Mouse", price: 25.99, code: "WM123" },
  { id: 2, name: "Bluetooth Speaker", price: 45.00, code: "BS456" },
  { id: 3, name: "Gaming Keyboard", price: 79.99, code: "GK789" },
  { id: 4, name: "HD Monitor", price: 120.00, code: "HD101" },
  { id: 5, name: "USB-C Hub", price: 19.50, code: "UC567" },
  { id: 6, name: "Laptop Stand", price: 32.00, code: "LS908" },
  { id: 7, name: "External SSD 1TB", price: 99.99, code: "SSD1TB" },
  { id: 8, name: "Webcam 1080p", price: 40.00, code: "WC1080" },
  { id: 9, name: "Mechanical Pencil", price: 2.99, code: "MP210" },
  { id: 10, name: "Noise Cancelling Headphones", price: 199.99, code: "NC900" },
  { id: 11, name: "Smartphone Tripod", price: 15.99, code: "TP333" },
  { id: 12, name: "Portable Charger 10000mAh", price: 25.00, code: "PC100" },
  { id: 13, name: "Wireless Earbuds", price: 55.00, code: "WE455" },
  { id: 14, name: "Desk Organizer", price: 12.50, code: "DO321" },
  { id: 15, name: "HDMI Cable 2m", price: 8.99, code: "HDMI2M" },
  { id: 16, name: "Ergonomic Chair", price: 145.00, code: "EC501" },
  { id: 17, name: "Smartwatch", price: 130.00, code: "SW650" },
  { id: 18, name: "Graphic Tablet", price: 88.50, code: "GT852" },
  { id: 19, name: "Mini Projector", price: 75.00, code: "MPROJ" },
  { id: 20, name: "LED Desk Lamp", price: 20.00, code: "LDL100" },
  { id: 21, name: "Wireless Router", price: 60.00, code: "WR300" },
  { id: 22, name: "Thermal Label Printer", price: 110.00, code: "TLP202" },
  { id: 23, name: "Smart Light Bulb", price: 10.99, code: "SLB007" },
  { id: 24, name: "USB Flash Drive 64GB", price: 14.00, code: "USB64" },
  { id: 25, name: "Laptop Cooling Pad", price: 22.50, code: "LCP250" },
  { id: 26, name: "Bluetooth Adapter", price: 6.99, code: "BA202" },
  { id: 27, name: "Wireless Charger", price: 18.00, code: "WC500" },
  { id: 28, name: "Gaming Mouse Pad", price: 9.99, code: "GMP321" },
  { id: 29, name: "Soundbar Speaker", price: 79.00, code: "SBAR99" },
  { id: 30, name: "Office Filing Cabinet", price: 155.00, code: "FC111" },
  { id: 31, name: "Stylus Pen", price: 11.00, code: "SP222" },
  { id: 32, name: "Fingerprint Lock", price: 40.00, code: "FPLOCK" },
  { id: 33, name: "Drone with Camera", price: 250.00, code: "DRONEX" },
  { id: 34, name: "VR Headset", price: 199.00, code: "VR888" },
  { id: 35, name: "Mini Fridge", price: 89.00, code: "MF150" },
  { id: 36, name: "Smart Thermostat", price: 145.00, code: "ST777" },
  { id: 37, name: "Compact Photo Printer", price: 120.00, code: "CPP999" },
  { id: 38, name: "Wireless Doorbell", price: 24.99, code: "WDB123" },
  { id: 39, name: "Digital Alarm Clock", price: 17.50, code: "DAC010" },
  { id: 40, name: "Fitness Tracker", price: 35.00, code: "FT202" },
  { id: 41, name: "USB Desk Fan", price: 14.99, code: "UDF300" },
  { id: 42, name: "LED Strip Lights", price: 22.99, code: "LSL333" },
  { id: 43, name: "Action Camera", price: 79.99, code: "ACAM123" },
  { id: 44, name: "Car Phone Holder", price: 10.00, code: "CPH444" },
  { id: 45, name: "Cable Organizer", price: 7.99, code: "CO101" },
  { id: 46, name: "Mechanical Stopwatch", price: 13.00, code: "MSW888" },
  { id: 47, name: "Whiteboard for Office", price: 48.00, code: "WBOFF" },
  { id: 48, name: "WiFi Repeater", price: 20.00, code: "WIFIEXT" },
  { id: 49, name: "Foldable Laptop Desk", price: 27.00, code: "FLD333" },
  { id: 50, name: "Electric Kettle", price: 34.00, code: "EK789" }
];

const Products = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {/* Product List can go here */}
      <ProductList products={dummyProducts} />

      {/* Custom Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Product</h3>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>
          
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
