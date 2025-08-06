import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PosProvider } from './context/PosContext';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
import AddPurchase from './pages/AddPurchase';
import Navbar from './components/NavBar';
import POS from './pages/POS';
import AddProduct from './pages/AddProduct';
import Categories from './pages/Categories';
import Brands from './pages/Brands';
import Units from './pages/Units';
function App() {
  return (
    <PosProvider>
      <BrowserRouter>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/units" element={<Units />} />
            <Route path="/product/add" element={<AddProduct />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/purchase/add" element={<AddPurchase />} />
          </Routes>
        </div>
      </BrowserRouter>
    </PosProvider>
  );
}

export default App;
