import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
import Invoices from './pages/Invoices';
import SalesReturn from './pages/SalesReturn';
import Customers from './pages/Customers';
import Billers from './pages/Billers';
import Suppliers from './pages/Suppliers';
import PurchaseReport from './pages/PurchaseReport';
import CustomerDueReport from './pages/CustomerDueReport';
import CustomerReport from './pages/CustomerReport';
import SalesReport from './pages/SalesReport';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { useEffect } from 'react';
function App() {
  useEffect(() => {
  window.electronAPI?.onBackendError((message) => {
    alert('Backend failed: ' + message);
  });
}, []);

  return (
    <PosProvider>
      <Router>
        <div className="flex flex-col h-screen">
          <Navbar className="h-[5%] min-h-[3rem]" />
          <div className="flex-1 overflow-hidden">
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/units" element={<Units />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/customers" element={<Customers/>} />
            <Route path="/billers" element={<Billers/>} />
            <Route path="/suppliers" element={<Suppliers/>} />
            <Route path="/sales/return" element={<SalesReturn />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="sales/report" element={<SalesReport />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/purchases/add" element={<AddPurchase />} />
            <Route path="/purchases/report" element={<PurchaseReport />} />
            <Route path="/customers/report/due" element={<CustomerDueReport />} />
            <Route path="/customers/report" element={<CustomerReport />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
          </div>
        </div>
      </Router>
    </PosProvider>
  );
}

export default App;
