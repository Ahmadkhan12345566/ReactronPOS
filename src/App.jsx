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

function App() {
  return (
    <PosProvider>
      <BrowserRouter>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
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
